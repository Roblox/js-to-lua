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
import * as crypto from 'crypto';
import {
  ChildExecException,
  ComparisonResponse,
  ConversionOptions,
  MergeSection,
  UpstreamFileMap,
  UpstreamReference,
} from './diff-tool.types';
import { renameFiles } from './rename-files';
import { applyPatch, commitFiles } from '@js-to-lua/upstream-utils';

// TODO: Fix @js-to-lua/shared-utils build to allow usage by diff-tool.
type Truthy<T> = NonNullable<T>;
const isTruthy = <T>(value: T): value is Truthy<T> => Boolean(value);

const DEFAULT_CONVERSION_OUTPUT_DIR = 'output';
const DEFAULT_PATCH_NAME = 'fast-follow.patch';
const FOREMAN_FILENAME = 'foreman.toml';
const STYLUA_FILENAME = '.stylua.toml';

const ROBLOX_UPSTREAM_REGEX = /-- ROBLOX upstream: (.*$)/;
const GITHUB_URL_REF_REGEX = /blob\/(.*?)\/(.*$)/;
const STYLUA_REGEX = /^stylua = { source = ".*", version = ".*" }$/;
const PATCH_ERROR_REGEX = /^error: (.*):(.*)$/;
const DIFF_FILE_HEADER_REGEX = /^diff --git a\/output\/(.*) b\/output\/(.*)$/;

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

  const targetRevision =
    options?.targetRevision ?? config.upstream.primaryBranch;
  const originalDir = process.cwd();
  const fullToolPath = path.join(
    path.resolve(toolPath),
    'dist/apps/convert-js-to-lua/main.js'
  );
  const conversionDir = path.join(os.tmpdir(), 'fast-follow-conversion');

  let failedFiles = new Set<string>();
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

    const fileMap = await getUpstreamSourceReferences(downstreamPath, config);

    // Step 1: Copy and convert referenced upstream files.

    console.log(`🔨 Converting referenced sources to Luau...`);

    const initialUpstreamResults = await convertUpstreamSources(
      config,
      conversionDir,
      fullToolPath,
      upstreamPath,
      fileMap,
      'port: initial upstream version'
    );
    stdout += initialUpstreamResults.stdout;
    stderr += initialUpstreamResults.stderr;

    // Step 2: Copy upstream sources from the new updated version and convert.

    console.log(`🔨 Converting latest sources to Luau...`);

    await git.checkoutBranch('upstream', 'main');

    const latestUpstreamResults = await convertUpstreamSources(
      config,
      conversionDir,
      fullToolPath,
      upstreamPath,
      fileMap,
      'port: latest upstream version',
      targetRevision
    );
    stdout += latestUpstreamResults.stdout;
    stderr += latestUpstreamResults.stderr;

    // Step 3: Commit existing downstream changes into their own branch.

    console.log(`🔨 Copying pre-existing downstream changes...`);

    await git.checkoutBranch('downstream', 'main');

    await copyDownstreamSources(
      conversionDir,
      downstreamPath,
      fileMap,
      'port: latest downstream version',
      config.downstream.primaryBranch
    );

    // Step 4: Merge automatic upstream changes into the downstream branch and
    // attempt to automatically resolve conflicts if they're present in favor or
    // deviations in the downstream.

    console.log(`↪️  Merging and automatically resolving conflicts...`);

    const mergeResults = await mergeUpstreamChanges(
      conversionDir,
      'port: automatic merge of upstream changes'
    );
    stdout += mergeResults.stdout;
    stderr += mergeResults.stderr;

    // Step 5: Generate a patch file in the current working directory.

    const outputDir = options?.outDir ?? originalDir;
    const patchPath = await generatePatch(conversionDir, outputDir);

    // Step 6: Apply the patch file to the repository.

    const { patchPath: newPatchPath, failedFiles: failedFilesFromFix } =
      await attemptFixPatch(downstreamPath, patchPath);
    failedFiles = failedFilesFromFix;

    console.log(`✅ ...done! Patch file written to '${newPatchPath}'\n`);
  } finally {
    process.chdir(originalDir);
  }

  return { failedFiles, stdout, stderr };
}

/**
 * Copy upstream sources for the version referenced at the top of each
 * downstream file respectively, and put them into the temporary repo.
 */
async function convertUpstreamSources(
  config: ConversionConfig,
  conversionDir: string,
  toolPath: string,
  upstreamPath: string,
  fileMap: UpstreamFileMap,
  message: string,
  targetRef?: string
) {
  let stdout = '';
  let stderr = '';

  await Promise.allSettled(
    Object.entries(fileMap).map(([downstreamFilePath, reference]) =>
      copyUpstreamFile(
        upstreamPath,
        downstreamFilePath,
        reference.path,
        targetRef ?? reference.ref
      )
    )
  );

  const initialUpstreamResponse = await convertSources(toolPath, conversionDir);
  stdout += initialUpstreamResponse.stdout;
  stderr += initialUpstreamResponse.stderr;

  const initialUpstreamStyleResponse = await styluaFormat(conversionDir);
  stdout += initialUpstreamStyleResponse.stdout;
  stderr += initialUpstreamStyleResponse.stderr;

  await renameFiles(DEFAULT_CONVERSION_OUTPUT_DIR, config);

  const outputDir = path.join(conversionDir, DEFAULT_CONVERSION_OUTPUT_DIR);
  await commitFiles(conversionDir, outputDir, message);

  return { stdout, stderr };
}

/**
 * Copy downstream sources from a specified ref into the conversion directory.
 */
async function copyDownstreamSources(
  conversionDir: string,
  downstreamPath: string,
  fileMap: UpstreamFileMap,
  message: string,
  targetRef: string
) {
  await Promise.allSettled(
    Object.keys(fileMap).map((downstreamFilePath) =>
      copyDownstreamFile(downstreamPath, downstreamFilePath, targetRef)
    )
  );

  const outputDir = path.join(conversionDir, DEFAULT_CONVERSION_OUTPUT_DIR);
  await commitFiles(conversionDir, outputDir, message);
}

/**
 * Merge upstream changes inside of the temporary repo with the downstream ones.
 */
async function mergeUpstreamChanges(conversionDir: string, message: string) {
  const git = simpleGit(conversionDir);

  let summary: MergeResult;
  let stdout = '';
  let stderr = '';

  try {
    summary = await git.mergeFromTo('upstream', 'downstream');
  } catch (e) {
    if (e instanceof GitResponseError) {
      summary = e.git;
    } else {
      throw e;
    }
  }

  for (const conflict of summary.conflicts) {
    if (conflict.file) {
      await resolveMergeConflicts(conflict.file);
    }
  }

  const mergedStyleResponse = await styluaFormat(conversionDir);
  stdout += mergedStyleResponse.stdout;
  stderr += mergedStyleResponse.stderr;

  const conflictFiles = summary.conflicts
    .map((conflict) => conflict.file)
    .filter(isTruthy);

  for (const file of conflictFiles) {
    await git.add(file);
  }

  await commitFiles(conversionDir, conflictFiles, message);

  return { stdout, stderr };
}

/**
 * Attempt to apply a patch to the target repository. Whenever files in the
 * unified diff fail to apply, they will be removed and the patch application
 * will be attempted again. This will happen either until the application
 * succeeds, or it gets stuck with the same error.
 */
async function attemptFixPatch(targetRepository: string, patchPath: string) {
  const newPatchFilename = `${crypto.randomBytes(16).toString('hex')}.patch`;
  const newPatchPath = path.join(os.tmpdir(), newPatchFilename);

  await fs.promises.copyFile(patchPath, newPatchPath);

  let allFailedFiles: Set<string> = new Set();
  let failedFiles: Set<string> = new Set();
  let lastError = '';
  let newPatchFile = '';

  do {
    try {
      await applyPatch(targetRepository, newPatchPath, { check: true });

      failedFiles = new Set();
    } catch (e) {
      if (e instanceof GitError) {
        const message = e.message;

        if (message === lastError) {
          throw new Error(
            `fatal: cannot apply patch '${newPatchPath}': ${message}`
          );
        }

        lastError = message ?? '';
      }

      failedFiles = new Set(
        lastError
          .split('\n')
          .map((error) => (error.match(PATCH_ERROR_REGEX) ?? [])[1])
          .filter((filename): filename is string => !!filename)
      );
      allFailedFiles = new Set([...allFailedFiles, ...failedFiles]);

      newPatchFile = await removeFilesFromUnifiedDiff(newPatchPath, [
        ...failedFiles,
      ]);
      await fs.promises.writeFile(newPatchPath, newPatchFile, {
        encoding: 'utf8',
      });
    }
  } while (failedFiles.size > 0);

  await fs.promises.writeFile(patchPath, newPatchFile, {
    encoding: 'utf8',
  });

  return { patchPath, failedFiles: allFailedFiles };
}

async function removeFilesFromUnifiedDiff(
  patchPath: string,
  filenames: string[]
) {
  const patchContents = await fs.promises.readFile(patchPath, {
    encoding: 'utf8',
  });
  const filenameSet = new Set(filenames);

  let filteredPatch = '';
  let inBadFile = false;

  for (const line of patchContents.split('\n')) {
    if (line.startsWith('diff --git a/')) {
      const header = line.match(DIFF_FILE_HEADER_REGEX) ?? [];
      const beforePath = header[1];
      const afterPath = header[2];

      inBadFile = filenameSet.has(beforePath) || filenameSet.has(afterPath);
    }

    if (!inBadFile) {
      filteredPatch += line + '\n';
    }
  }

  return filteredPatch;
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
): Promise<UpstreamFileMap> {
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
  }, {} as UpstreamFileMap);
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
async function convertSources(toolPath: string, conversionDir: string) {
  const originalDir = process.cwd();

  try {
    const execFile = util.promisify(childProcessExecFile);

    process.chdir(conversionDir);

    return execFile(
      'node',
      [toolPath, '-o', DEFAULT_CONVERSION_OUTPUT_DIR, '-i', '**/*'],
      { maxBuffer: Infinity }
    );
  } finally {
    process.chdir(originalDir);
  }
}

function errorHasOutput(e: Error): e is ChildExecException {
  return 'stderr' in e || 'stdout' in e;
}
