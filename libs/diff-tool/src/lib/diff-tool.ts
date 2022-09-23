import { ConversionConfig } from '@roblox/release-tracker';
import * as fs from 'fs';
import * as g from 'glob';
import { lookpath } from 'lookpath';
import { execFile as childProcessExecFile } from 'node:child_process';
import * as os from 'os';
import * as path from 'path';
import * as process from 'process';
import {
  CheckRepoActions,
  GitError,
  GitResponseError,
  MergeResult,
  simpleGit,
} from 'simple-git';
import * as util from 'util';
import {
  ChildExecException,
  ComparisonResponse,
  ConversionOptions,
  MergeSection,
  SourceMapping,
  UpstreamReference,
} from './diff-tool.types';
import { logConflictsSummary } from './log-conflicts-summary';
import { renameFiles } from './rename-files';

const DEFAULT_CONVERSION_OUTPUT_DIR = 'output';
const DEFAULT_PATCH_NAME = 'fast-follow.patch';
const FOREMAN_FILENAME = 'foreman.toml';
const STYLUA_FILENAME = '.stylua.toml';

const ROBLOX_UPSTREAM_REGEX = /-- ROBLOX upstream: (.*$)/;
const GITHUB_URL_REF_REGEX = /blob\/(.*?)\/(.*$)/;
const STYLUA_REGEX = /^stylua = { source = ".*", version = ".*" }$/;

/**
 * Generate a unified diff containing non-conflicting upstream changes in files
 * that contain an upstream reference.
 */
export async function compare(
  config: ConversionConfig,
  toolPath: string,
  upstreamPath: string,
  downstreamPath: string,
  options?: ConversionOptions
): Promise<ComparisonResponse> {
  const git = simpleGit();

  await git.cwd(downstreamPath);
  await git.checkout(config.downstream.primaryBranch);

  const originalDir = process.cwd();
  const fullToolPath = path.join(
    path.resolve(toolPath),
    'dist/apps/convert-js-to-lua/main.js'
  );
  const conversionDir = path.join(os.tmpdir(), 'fast-follow-conversion');

  let stdout = '';
  let stderr = '';

  try {
    process.chdir(downstreamPath);
    await git.cwd(downstreamPath);

    if (!git.checkIsRepo(CheckRepoActions.IN_TREE)) {
      throw new Error(
        `Unable to run conversion for '${downstreamPath}': destination directory is not a git repository`
      );
    } else if (config.downstream.patterns.length < 1) {
      throw new Error(
        `Unable to run conversion for '${downstreamPath}': no source patterns are specified in the downstream conversion config`
      );
    }

    // Attempt to remove the conversion directory if a previous run created one
    // earlier. This is done to prevent previous conversions from interfering
    // with the current one.
    await fs.promises.rm(conversionDir, { recursive: true, force: true });
    await fs.promises.mkdir(conversionDir, { recursive: true });
    process.chdir(conversionDir);

    await git.cwd(conversionDir);
    await git.init();

    await setupStylua(downstreamPath, conversionDir);

    const sourceMapping = await getUpstreamSourceReferences(
      downstreamPath,
      config
    );

    // Step 1: Copy and convert referenced upstream files.

    // Copy upstream sources for the version referenced at the top of each
    // downstream file respectively, and put them into the temporary repo.
    await Promise.allSettled(
      Object.entries(sourceMapping).map(([downstreamFilePath, reference]) =>
        copyUpstreamFile(
          upstreamPath,
          downstreamFilePath,
          reference.path,
          reference.ref
        )
      )
    );

    console.log(`🔨 Converting referenced sources to Luau...`);
    const initialUpstreamResponse = await convertSources(fullToolPath);
    stdout += initialUpstreamResponse.stdout;
    stderr += initialUpstreamResponse.stderr;

    const initialUpstreamStyleResponse = await styluaFormat(conversionDir);
    stdout += initialUpstreamStyleResponse.stdout;
    stderr += initialUpstreamStyleResponse.stderr;

    await renameFiles(DEFAULT_CONVERSION_OUTPUT_DIR, config);

    await git.add(DEFAULT_CONVERSION_OUTPUT_DIR);
    await git.commit(`port: initial upstream version`);

    // Step 2: Copy upstream sources from the new updated version and convert.

    await git.checkoutBranch('upstream', 'main');

    await Promise.allSettled(
      Object.entries(sourceMapping).map(([downstreamFilePath, reference]) =>
        copyUpstreamFile(
          upstreamPath,
          downstreamFilePath,
          reference.path,
          options?.targetRevision ?? config.upstream.primaryBranch
        )
      )
    );

    console.log(`🔨 Converting latest sources to Luau...`);
    const latestUpstreamResponse = await convertSources(fullToolPath);
    stdout += latestUpstreamResponse.stdout;
    stderr += latestUpstreamResponse.stderr;

    const latestUpstreamStyleResponse = await styluaFormat(conversionDir);
    stdout += latestUpstreamStyleResponse.stdout;
    stderr += latestUpstreamStyleResponse.stderr;

    await renameFiles(DEFAULT_CONVERSION_OUTPUT_DIR, config);

    await git.add(DEFAULT_CONVERSION_OUTPUT_DIR);
    await git.commit(`port: latest upstream version`);

    // Step 3: Commit existing downstream changes into their own branch.

    await git.checkoutBranch('downstream', 'main');

    await Promise.allSettled(
      Object.keys(sourceMapping).map((downstreamFilePath) =>
        copyDownstreamFile(
          downstreamPath,
          downstreamFilePath,
          config.downstream.primaryBranch
        )
      )
    );

    await git.add(DEFAULT_CONVERSION_OUTPUT_DIR);
    await git.commit(`port: latest downstream version`);

    // Step 4: Merge automatic upstream changes into the downstream branch and
    // attempt to automatically resolve conflicts if they're present in favor or
    // deviations in the downstream.

    console.log(`↪️  Merging and automatically resolving conflicts...`);

    let summary: MergeResult;

    try {
      summary = await git.mergeFromTo('upstream', 'downstream');
    } catch (e) {
      if (e instanceof GitResponseError) {
        summary = e.git;
      } else {
        throw e;
      }
    }

    let conflictsSummary: { [key: string]: number } = {};
    for (const conflict of summary.conflicts) {
      if (conflict.file) {
        conflictsSummary = {
          ...conflictsSummary,
          ...(await resolveMergeConflicts(conflict.file)),
        };
      }
    }

    logConflictsSummary(conflictsSummary);

    const mergedStyleResponse = await styluaFormat(conversionDir);
    stdout += mergedStyleResponse.stdout;
    stderr += mergedStyleResponse.stderr;

    for (const conflict of summary.conflicts) {
      if (conflict.file) {
        await git.add(conflict.file);
      }
    }

    await git.commit(`port: automatic merge of upstream changes`);

    // Step 5: Generate a patch file in the current working directory.

    const outputDir = options?.outDir ?? originalDir;
    const patchPath = await generatePatch(conversionDir, outputDir);

    console.log(`✅ ...done! Patch file written to '${patchPath}'\n`);
  } finally {
    process.chdir(originalDir);
  }

  return { stdout, stderr };
}

async function setupStylua(downstreamPath: string, conversionDir: string) {
  const execFile = util.promisify(childProcessExecFile);
  const originalDir = process.cwd();

  const downstreamForemanPath = path.join(downstreamPath, FOREMAN_FILENAME);
  if (!fs.existsSync(downstreamForemanPath)) {
    throw new Error('fatal: no foreman.toml is present in the downstream repo');
  }

  if (!(await lookpath('foreman'))) {
    throw new Error('fatal: foreman must be installed to install stylua');
  }

  const foremanConfig = await fs.promises.readFile(downstreamForemanPath, {
    encoding: 'utf8',
  });
  let styluaDefinition = '';

  for (const line of foremanConfig.split('\n')) {
    if (STYLUA_REGEX.test(line)) {
      styluaDefinition = line;
      break;
    }
  }

  if (!styluaDefinition) {
    throw new Error('fatal: no stylua version specified in foreman.toml');
  }

  const newForemanPath = path.join(conversionDir, FOREMAN_FILENAME);
  const newForemanConfig = `[tools]\n${styluaDefinition}`;
  await fs.promises.writeFile(newForemanPath, newForemanConfig);

  try {
    process.chdir(conversionDir);

    await execFile('foreman', ['install'], { maxBuffer: Infinity });

    const downstreamStyluaPath = path.join(downstreamPath, STYLUA_FILENAME);
    const destinationStyluaPath = path.join(conversionDir, STYLUA_FILENAME);

    if (fs.existsSync(downstreamStyluaPath)) {
      await fs.promises.copyFile(downstreamStyluaPath, destinationStyluaPath);
    }
  } finally {
    process.chdir(originalDir);
  }
}

async function styluaFormat(conversionDir: string) {
  const execFile = util.promisify(childProcessExecFile);
  const originalDir = process.cwd();

  try {
    process.chdir(conversionDir);
    const response = await execFile('stylua', ['.'], { maxBuffer: Infinity });
    return response;
  } catch (e) {
    let stdout, stderr;
    if (e instanceof Error && errorHasOutput(e) && e.stdout) {
      stdout = e.stdout;
    }
    if (e instanceof Error && errorHasOutput(e) && e.stderr) {
      stderr = e.stderr;
    }

    if (stdout) {
      console.log(stderr);
    }
    if (stderr) {
      console.error(stderr);
    }

    return { stdout, stderr };
  } finally {
    process.chdir(originalDir);
  }
}

async function getUpstreamSourceReferences(
  downstreamPath: string,
  config: ConversionConfig
): Promise<SourceMapping> {
  const glob = util.promisify(g);

  let sources: string[] = [];
  for (const pattern of config.downstream.patterns) {
    const files = await glob(pattern, { cwd: downstreamPath });
    sources = sources.concat(files);
  }

  return sources.reduce((previous, current) => {
    const upstreamUrl = extractUpstreamFileUrl(
      path.join(downstreamPath, current)
    );
    if (upstreamUrl) {
      const upstreamReference = extractUpstreamReferenceFromUrl(upstreamUrl);
      if (upstreamReference) {
        previous[current] = upstreamReference;
      }
    }
    return previous;
  }, {} as SourceMapping);
}

function extractUpstreamFileUrl(filepath: string): string | undefined {
  const contents = fs.readFileSync(filepath, { encoding: 'utf-8' }).split('\n');

  for (const line of contents) {
    const match = line.match(ROBLOX_UPSTREAM_REGEX);

    if (match && match.length >= 1) {
      return match[1];
    }
  }
}

function extractUpstreamReferenceFromUrl(
  url: string
): UpstreamReference | undefined {
  const match = url.match(GITHUB_URL_REF_REGEX);

  if (match && match.length >= 2) {
    const reference = { ref: match[1], path: match[2] };

    if (
      reference.ref !== 'main' &&
      reference.ref !== 'master' &&
      reference.ref !== 'develop'
    ) {
      return reference;
    }
  }
}

/**
 * Automatically resolve merge conflicts in favor of downstream.
 */
async function resolveMergeConflicts(file: string) {
  const contents = await fs.promises.readFile(file, { encoding: 'utf-8' });

  let sectionType = MergeSection.Resolved;
  let resolvedContents = '';
  let count = 0;

  for (const line of contents.split('\n')) {
    if (line.startsWith('<<<<<<<')) {
      sectionType = MergeSection.Current;
      count++;
    } else if (line.startsWith('=======')) {
      sectionType = MergeSection.Incoming;
    } else if (line.startsWith('>>>>>>>')) {
      sectionType = MergeSection.Resolved;
    } else if (
      sectionType === MergeSection.Resolved ||
      sectionType === MergeSection.Current
    ) {
      resolvedContents += line + '\n';
    }
  }

  resolvedContents = `${resolvedContents.trimEnd()}\n`;

  await fs.promises.writeFile(file, resolvedContents);
  return count > 0 ? { [file]: count } : {};
}

/**
 * Fetches an upstream file at a given path and ref and writes it to a
 * designated working directory for later conversion.
 */
async function copyUpstreamFile(
  upstreamDir: string,
  downstreamFilePath: string,
  upstreamFilePath: string,
  upstreamRef: string
) {
  const git = simpleGit();
  const upstreamFilename = path.basename(upstreamFilePath);
  const fullDownstreamPath = path.join(
    downstreamFilePath,
    '..',
    upstreamFilename
  );

  try {
    await git.cwd(path.resolve(upstreamDir));
    const contents = await git.show(`${upstreamRef}:${upstreamFilePath}`);

    await fs.promises.mkdir(path.join(fullDownstreamPath, '..'), {
      recursive: true,
    });
    await fs.promises.writeFile(fullDownstreamPath, contents);
  } catch (e) {
    if (e instanceof GitError) {
      console.error(
        'warn: unable to find upstream ref for downstream file:',
        e.message.trim()
      );
    } else {
      throw e;
    }
  }
}

async function copyDownstreamFile(
  downstreamDir: string,
  downstreamFilePath: string,
  downstreamRef: string
) {
  const git = simpleGit();
  const fullDownstreamPath = path.join(
    DEFAULT_CONVERSION_OUTPUT_DIR,
    downstreamFilePath
  );

  try {
    await git.cwd(path.resolve(downstreamDir));
    const contents = await git.show(`${downstreamRef}:${downstreamFilePath}`);

    await fs.promises.mkdir(path.join(fullDownstreamPath, '..'), {
      recursive: true,
    });
    await fs.promises.writeFile(fullDownstreamPath, contents);
  } catch (e) {
    if (e instanceof GitError) {
      console.error(
        'warn: unable to find downstream ref for file:',
        e.message.trim()
      );
    } else {
      throw e;
    }
  }
}

/**
 * Generates a patch file for the latest commit.
 *
 * All occurrences of the temporary output directory are also replace so the
 * paths reflect the downstream repository's structure.
 */
async function generatePatch(
  conversionDir: string,
  outputDir: string
): Promise<string> {
  const git = simpleGit();

  await git.cwd(conversionDir);
  const contents = (await git.diff(['HEAD~1'])).split('\n');

  const patch = contents
    .map((line) => {
      if (line.startsWith('--- a/')) {
        return line.replace(
          `--- a/${DEFAULT_CONVERSION_OUTPUT_DIR}/`,
          '--- a/'
        );
      } else if (line.startsWith('+++ b/')) {
        return line.replace(
          `+++ b/${DEFAULT_CONVERSION_OUTPUT_DIR}/`,
          '+++ b/'
        );
      } else {
        return line;
      }
    })
    .join('\n');

  const patchPath = path.join(outputDir, DEFAULT_PATCH_NAME);
  await fs.promises.writeFile(patchPath, patch);

  return patchPath;
}

/**
 * Convert all TypeScript and JavaScript sources to Luau.
 */
async function convertSources(toolPath: string) {
  const execFile = util.promisify(childProcessExecFile);

  return execFile(
    'node',
    [toolPath, '-o', DEFAULT_CONVERSION_OUTPUT_DIR, '-i', '**/*'],
    { maxBuffer: Infinity }
  );
}

function errorHasOutput(e: Error): e is ChildExecException {
  return 'stderr' in e || 'stdout' in e;
}
