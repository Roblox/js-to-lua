import { commitFiles } from '@js-to-lua/upstream-utils';
import { ConversionConfig } from '@roblox/release-tracker';
import { mkdir, readFile, realpath, rm, writeFile } from 'fs/promises';
import * as g from 'glob';
import {
  exec as childProcessExec,
  execFile as childProcessExecFile,
} from 'node:child_process';
import * as os from 'os';
import * as path from 'path/posix';
import * as process from 'process';
import { groupBy } from 'ramda';
import {
  CheckRepoActions,
  GitError,
  GitResponseError,
  MergeResult,
  SimpleGit,
  simpleGit,
} from 'simple-git';
import * as util from 'util';
import { attemptFixPatch } from './attempt-fix-patch';
import {
  ChildExecException,
  ComparisonResponse,
  ConflictsSummary,
  ConversionOptions,
  MergeSection,
  UpstreamFileMap,
  UpstreamReference,
} from './diff-tool.types';
import { JsToLuaOptions } from './js-to-lua.types';
import { logConflictsSummary } from './log-conflicts-summary';
import { renameFiles } from './rename-files';
import { applyKnownDeviations } from './deviations';

export * from './diff-tool.types';
export * from './js-to-lua.types';
export * from './log-conflicts-summary';

// TODO: Fix @js-to-lua/shared-utils build to allow usage by diff-tool.
type Truthy<T> = NonNullable<T>;
const isTruthy = <T>(value: T): value is Truthy<T> => Boolean(value);

const DEFAULT_CONVERSION_INPUT_DIR = 'input';
const DEFAULT_CONVERSION_OUTPUT_DIR = 'output';
const DEFAULT_PATCH_NAME = 'fast-follow.patch';

const ROBLOX_UPSTREAM_REGEX = /-- ROBLOX upstream: (.*$)/;
const GITHUB_URL_REF_REGEX = /blob\/(.*?)\/(.*$)/;

/**
 * Generate a unified diff containing non-conflicting upstream changes in files
 * that contain an upstream reference.
 */
export async function compare(
  config: ConversionConfig,
  toolPath: string,
  upstreamPath: string,
  downstreamPath: string,
  options: ConversionOptions,
  jsToLuaOptions: JsToLuaOptions
): Promise<ComparisonResponse> {
  const gitClient = simpleGit();

  await gitClient.cwd(downstreamPath);
  await gitClient.checkout(config.downstream.primaryBranch);

  const targetRevision =
    options?.targetRevision ?? config.upstream.primaryBranch;

  const originalDir = process.cwd();

  try {
    process.chdir(downstreamPath);
    const { conflictsSummary, patchPath, failedFiles, stdout, stderr } =
      await Promise.resolve({
        conversionDir: path.join(os.tmpdir(), 'fast-follow-conversion'),
        git: gitClient,
        stdout: '',
        stderr: '',
      })
        .then(verifyDownstreamRepoStep())
        .then(initConversionDirStep())
        .then(initRepoStep())
        .then(createFileMapStep())
        .then(downstreamCleanStep())
        .then(downstreamApplyStep())
        .then(upstreamCleanStep())
        .then(upstreamApplyStep())
        .then(downstreamCurrentStep())
        .then(mergeStep())
        .then(generatePatchStep('fast-follow-conflicts.patch'))
        .then(applyPatchStep())
        .then(resolveConflictsStep())
        .then(generatePatchStep());

    return {
      failedFiles,
      stdout,
      stderr,
      patchPath,
      revision: targetRevision,
      conflictsSummary,
    };
  } finally {
    process.chdir(originalDir);
  }

  type StepParams = { git: SimpleGit; stdout: string; stderr: string };
  type ConversionDirParam = { conversionDir: string };
  type FileMapParam = { fileMap: UpstreamFileMap };

  function verifyDownstreamRepoStep() {
    return async <T extends Record<string, unknown> & ConversionDirParam>(
      params: StepParams & T
    ): Promise<StepParams & T> => {
      await gitClient.cwd(downstreamPath);

      if (!gitClient.checkIsRepo(CheckRepoActions.IN_TREE)) {
        throw new Error(
          `Unable to run conversion for '${downstreamPath}': destination directory is not a git repository`
        );
      } else if (config.downstream.patterns.length < 1) {
        throw new Error(
          `Unable to run conversion for '${downstreamPath}': no source patterns are specified in the downstream conversion config`
        );
      }

      return params;
    };
  }

  function initConversionDirStep() {
    return async <T extends Record<string, unknown> & ConversionDirParam>(
      params: StepParams & T
    ): Promise<StepParams & T> => {
      const { conversionDir } = params;
      // Attempt to remove the conversion directory if a previous run created one
      // earlier. This is done to prevent previous conversions from interfering
      // with the current one.
      await rm(conversionDir, { recursive: true, force: true });
      await mkdir(conversionDir, { recursive: true });
      await mkdir(`${conversionDir}/${DEFAULT_CONVERSION_INPUT_DIR}`, {
        recursive: true,
      });
      process.chdir(conversionDir);

      return params;
    };
  }

  function initRepoStep() {
    return async <T extends Record<string, unknown> & ConversionDirParam>(
      params: StepParams & T
    ): Promise<StepParams & T> => {
      const { git, conversionDir } = params;
      await git.cwd(conversionDir);
      await git.init();
      await git.branch(['-m', 'main']);

      return params;
    };
  }

  function createFileMapStep() {
    return async <T extends Record<string, unknown>>(
      params: StepParams & T
    ): Promise<StepParams & T & FileMapParam> => {
      const fileMap = await getUpstreamSourceReferences(downstreamPath, config);

      return { ...params, fileMap };
    };
  }

  function downstreamCleanStep() {
    return async <
      T extends Record<string, unknown> & ConversionDirParam & FileMapParam
    >(
      params: StepParams & T
    ): Promise<StepParams & T> => {
      const { conversionDir, fileMap, git } = params;
      // Step 1: Copy and convert referenced upstream files.

      await git.checkoutLocalBranch('downstream-clean');
      console.log(`🔨 Converting referenced sources to Luau...`);

      const initialUpstreamResults = await convertUpstreamSources(
        config,
        {
          conversionDir,
          toolPath,
          upstreamPath,
          fileMap,
          message: 'port: initial upstream version',
        },
        jsToLuaOptions
      );

      return appendOutputs(params, initialUpstreamResults);
    };
  }

  function upstreamCleanStep() {
    return async <
      T extends Record<string, unknown> & ConversionDirParam & FileMapParam
    >(
      params: StepParams & T
    ): Promise<StepParams & T> => {
      const { git, conversionDir, fileMap } = params;
      // Step 2: Copy upstream sources from the new updated version and convert.

      console.log(`🔨 Converting latest sources to Luau...`);

      await git.checkoutBranch('upstream-clean', 'downstream-apply');

      const latestUpstreamResults = await convertUpstreamSources(
        config,
        {
          conversionDir,
          toolPath,
          upstreamPath,
          fileMap,
          message: 'port: latest upstream version',
          targetRef: targetRevision,
        },
        { ...jsToLuaOptions, sha: targetRevision }
      );

      return appendOutputs(params, latestUpstreamResults);
    };
  }

  function downstreamApplyStep() {
    return deviationsStep('downstream');
  }

  function upstreamApplyStep() {
    return deviationsStep('upstream');
  }

  function deviationsStep(branchPrefix: string) {
    return async <
      T extends Record<string, unknown> & ConversionDirParam & FileMapParam
    >(
      params: StepParams & T
    ): Promise<StepParams & T> => {
      const { fileMap, git } = params;

      await git.checkoutBranch(
        `${branchPrefix}-apply`,
        `${branchPrefix}-clean`
      );

      console.log('🔨 Applying deviations');

      await Promise.allSettled(
        Object.keys(fileMap).map(async (file) => {
          const pathLeft = path.join(downstreamPath, file);
          const pathRight = path.join(
            params.conversionDir,
            DEFAULT_CONVERSION_OUTPUT_DIR,
            file
          );
          const [left, right] = await Promise.all([
            readFile(pathLeft, { encoding: 'utf-8' }),
            readFile(pathRight, { encoding: 'utf-8' }),
          ]);
          const result = applyKnownDeviations(left, right);
          if (result === right) {
            return;
          }

          console.log(`... ${pathRight} has new deviations`);

          await writeFile(pathRight, result, { encoding: 'utf-8' });
        })
      );
      await git.add(DEFAULT_CONVERSION_OUTPUT_DIR);
      await git.commit('port: apply deviations');

      return params;
    };
  }

  function downstreamCurrentStep() {
    return async <
      T extends Record<string, unknown> & ConversionDirParam & FileMapParam
    >(
      params: StepParams & T
    ): Promise<StepParams & T> => {
      const { git, conversionDir, fileMap } = params;
      // Step 3: Commit existing downstream changes into their own branch.

      console.log(`🔨 Copying pre-existing downstream changes...`);

      await git.checkoutBranch('downstream-current', 'downstream-apply');

      await copyDownstreamSources(
        conversionDir,
        downstreamPath,
        fileMap,
        'port: latest downstream version',
        config.downstream.primaryBranch
      );

      return params;
    };
  }

  function mergeStep() {
    return async <T extends Record<string, unknown> & ConversionDirParam>(
      params: StepParams & T
    ): Promise<StepParams & T & { gitSummary: MergeResult }> => {
      const { conversionDir } = params;
      // Step 4: Merge automatic upstream changes into the downstream branch and
      // attempt to automatically resolve conflicts if they're present in favor or
      // deviations in the downstream.

      console.log(`↪️  Merging and automatically resolving conflicts...`);

      const mergeResults = await mergeUpstreamChanges(
        conversionDir,
        'port: automatic merge of upstream changes'
      );

      return appendOutputs(
        { ...params, gitSummary: mergeResults.gitSummary },
        mergeResults
      );
    };
  }

  function generatePatchStep(patchName?: string) {
    return async <T extends Record<string, unknown> & ConversionDirParam>(
      params: StepParams & T
    ): Promise<StepParams & T & { patchPath: string }> => {
      const { conversionDir } = params;
      // Step 5: Generate a patch file in the current working directory.

      const outputDir = options?.outDir ?? originalDir;
      const patchPath = await generatePatch(
        conversionDir,
        outputDir,
        patchName
      );

      return { ...params, patchPath };
    };
  }

  function applyPatchStep() {
    return async <T extends Record<string, unknown> & { patchPath: string }>(
      params: StepParams & T
    ): Promise<StepParams & T & { failedFiles: Set<string> }> => {
      // Step 6: Apply the patch file to the repository.

      const { patchPath: newPatchPath, failedFiles: failedFilesFromFix } =
        await attemptFixPatch(downstreamPath, params.patchPath);

      console.log(`✅ ...done! Patch file written to '${newPatchPath}'\n`);

      return {
        ...params,
        patchPath: newPatchPath,
        failedFiles: failedFilesFromFix,
      };
    };
  }

  function resolveConflictsStep() {
    return async <T extends { patchPath: string; gitSummary: MergeResult }>(
      params: StepParams & T
    ) => {
      const { git, gitSummary: summary } = params;
      let conflictsSummary: ConflictsSummary = {};

      await git.add(DEFAULT_CONVERSION_OUTPUT_DIR);
      await git.commit('port: store conflicted merge', { '--amend': null });

      for (const conflict of summary.conflicts) {
        if (conflict.file) {
          conflictsSummary = {
            ...conflictsSummary,
            ...(await resolveMergeConflicts(conflict.file)),
          };
        }
      }

      logConflictsSummary(conflictsSummary);
      await git.add(DEFAULT_CONVERSION_OUTPUT_DIR);
      await git.commit('port: resolve conflicts for final patch');

      return { ...params, conflictsSummary };
    };
  }
}

type ConvertUpstreamSourcesOptions = {
  conversionDir: string;
  toolPath: string;
  upstreamPath: string;
  fileMap: UpstreamFileMap;
  message: string;
  targetRef?: string;
};

/**
 * Copy upstream sources for the version referenced at the top of each
 * downstream file respectively, and put them into the temporary repo.
 */
async function convertUpstreamSources(
  config: ConversionConfig,
  options: ConvertUpstreamSourcesOptions,
  jsToLuaOptions: JsToLuaOptions
) {
  const { conversionDir, toolPath, upstreamPath, fileMap, message, targetRef } =
    options;
  let stdout = '';
  let stderr = '';

  await Promise.allSettled(
    Object.values(fileMap).map((reference) =>
      copyUpstreamFile(upstreamPath, reference.path, targetRef ?? reference.ref)
    )
  );

  const initialUpstreamResponse = await convertSources(
    toolPath,
    conversionDir,
    fileMap,
    jsToLuaOptions
  );
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
    summary = await git.mergeFromTo('upstream-apply', 'downstream-current');
  } catch (e) {
    if (e instanceof GitResponseError) {
      summary = e.git;
    } else {
      throw e;
    }
  }

  const mergedStyleResponse = await styluaFormat(conversionDir);
  stdout += mergedStyleResponse.stdout;
  stderr += mergedStyleResponse.stderr;

  const conflictFiles = summary.conflicts
    .map((conflict) => conflict.file)
    .filter(isTruthy);

  await commitFiles(conversionDir, conflictFiles, message);

  return { stdout, stderr, gitSummary: summary };
}

async function styluaFormat(conversionDir: string) {
  const exec = util.promisify(childProcessExec);
  const originalDir = process.cwd();

  try {
    process.chdir(conversionDir);
    return await exec('npx @johnnymorganz/stylua-bin .');
  } catch (e) {
    let stdout = '';
    let stderr = '';
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

  const map = {} as UpstreamFileMap;
  for (const source of sources) {
    const upstreamUrl = await extractUpstreamFileUrl(
      path.join(downstreamPath, source)
    );
    if (upstreamUrl) {
      const upstreamReference = extractUpstreamReferenceFromUrl(upstreamUrl);
      if (upstreamReference) {
        map[source] = upstreamReference;
      }
    }
  }
  return map;
}

async function extractUpstreamFileUrl(
  filepath: string
): Promise<string | undefined> {
  const fileContent = await readFile(filepath, { encoding: 'utf-8' });
  const contents = fileContent.split('\n');

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
  const contents = await readFile(file, { encoding: 'utf-8' });

  let sectionType = MergeSection.Resolved;
  let resolvedContents = '';
  let count = 0;
  let lineCount = 0;
  let lineSum = 0;

  for (const line of contents.split('\n')) {
    lineCount++;
    if (line.startsWith('<<<<<<<')) {
      sectionType = MergeSection.Current;
      count++;
      lineCount = 0;
    } else if (line.startsWith('=======')) {
      sectionType = MergeSection.Incoming;
      lineCount--;
    } else if (line.startsWith('>>>>>>>')) {
      sectionType = MergeSection.Resolved;
      lineSum += lineCount - 1;
    } else if (
      sectionType === MergeSection.Resolved ||
      sectionType === MergeSection.Current
    ) {
      resolvedContents += line + '\n';
    }
  }

  resolvedContents = `${resolvedContents.trimEnd()}\n`;

  await writeFile(file, resolvedContents);
  return count > 0 ? { [file]: { conflicts: count, lines: lineSum } } : {};
}

/**
 * Fetches an upstream file at a given path and ref and writes it to a
 * designated working directory for later conversion.
 */
async function copyUpstreamFile(
  upstreamDir: string,
  upstreamFilePath: string,
  upstreamRef: string
) {
  const git = simpleGit();

  try {
    await git.cwd(path.resolve(upstreamDir));
    const contents = await git.show(`${upstreamRef}:${upstreamFilePath}`);

    await mkdir(
      path.join(
        DEFAULT_CONVERSION_INPUT_DIR,
        upstreamRef,
        upstreamFilePath,
        '..'
      ),
      {
        recursive: true,
      }
    );
    await writeFile(
      path.join(DEFAULT_CONVERSION_INPUT_DIR, upstreamRef, upstreamFilePath),
      contents
    );
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

    await mkdir(path.join(fullDownstreamPath, '..'), {
      recursive: true,
    });
    await writeFile(fullDownstreamPath, contents);
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
  outputDir: string,
  patchName?: string
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

  const patchPath = path.join(outputDir, patchName || DEFAULT_PATCH_NAME);
  await writeFile(patchPath, patch);

  return patchPath;
}

/**
 * Convert all TypeScript and JavaScript sources to Luau.
 */
async function convertSources(
  toolPath: string,
  conversionDir: string,
  fileMap: UpstreamFileMap,
  jsToLuaOptions: JsToLuaOptions
) {
  const { sha, remoteUrl, plugins, babelConfig, babelTransformConfig } =
    jsToLuaOptions;

  const DIST_MAIN_FILE = 'dist/apps/convert-js-to-lua/main.js';
  const originalDir = process.cwd();
  process.chdir(path.resolve(toolPath));
  let stdout = '';
  let stderr = '';
  try {
    const execFile = util.promisify(childProcessExecFile);

    // TODO: realpath should be handled by the conversion tool
    conversionDir = await realpath(conversionDir);

    const files = Object.keys(fileMap).map((key) => {
      return {
        key,
        ...fileMap[key],
      };
    }, []);

    const groupByRef = groupBy(
      (file: { ref: string; path: string; key: string }) => sha || file.ref
    );

    const groups = groupByRef(files);

    for (const revision of Object.keys(groups)) {
      const args = [
        DIST_MAIN_FILE,
        '-o',
        `${conversionDir}/${DEFAULT_CONVERSION_OUTPUT_DIR}`,
        '-i',
        `${conversionDir}/${DEFAULT_CONVERSION_INPUT_DIR}/${revision}/**/*`,
        '--rootDir',
        `${conversionDir}/${DEFAULT_CONVERSION_INPUT_DIR}/${revision}`,
      ];

      if (babelConfig) {
        args.push('--babelConfig', babelConfig);
      }
      if (babelTransformConfig) {
        args.push('--babelTransformConfig', babelTransformConfig);
      }

      if (remoteUrl && revision) {
        args.push('--remoteUrl', remoteUrl, '--sha', revision);
      }

      if (plugins && plugins.length) {
        args.push(...plugins.map((plugin) => ['--plugin', plugin]).flat());
      }

      console.log(
        'converting:',
        `${conversionDir}/${DEFAULT_CONVERSION_INPUT_DIR}/${revision}/**/*`
      );
      stdout += `node ${args.join(' ')}`;

      const { stdout: out, stderr: err } = await execFile('node', args, {
        maxBuffer: Infinity,
      });
      stdout += out ? `${out}\n` : '';
      stderr += err ? `${err}\n` : '';
    }

    return { stdout, stderr };
  } finally {
    process.chdir(originalDir);
  }
}

function errorHasOutput(e: Error): e is ChildExecException {
  return 'stderr' in e || 'stdout' in e;
}

function appendOutputs<R extends Record<string, unknown>>(
  dst: R & { stdout: string; stderr: string },
  src: { stdout: string; stderr: string }
): R & { stdout: string; stderr: string } {
  return {
    ...dst,
    stdout: dst.stdout + src.stdout,
    stderr: dst.stderr + src.stderr,
  };
}
