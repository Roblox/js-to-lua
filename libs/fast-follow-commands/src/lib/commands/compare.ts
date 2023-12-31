import {
  compare,
  ComparisonResponse,
  ConflictsSummary,
  JsToLuaOptions,
} from '@roblox/diff-tool';
import {
  findRepositoryRoot,
  setupConversionTool,
  setupUpstreamRepository,
} from '@roblox/version-manager';
import { ExecException } from 'child_process';
import { writeFile } from 'fs/promises';
import { last } from 'ramda';
import { getConfig } from './get-config';

const STDOUT_FILENAME = 'fast-follow.stdout.log';
const STDERR_FILENAME = 'fast-follow.stderr.log';

export interface CompareOptions {
  log: boolean;
  outDir?: string;
  revision?: string;
  sourceDir: string;
}

interface ChildExecException extends ExecException {
  stdout?: string;
  stderr?: string;
}

export async function compareSinceLastSync(
  options: CompareOptions,
  jsToLuaOptions: JsToLuaOptions
): Promise<ComparisonResponse> {
  const config = await getConfig(options.sourceDir);
  const downstreamRepoRoot = await findRepositoryRoot(options.sourceDir);
  if (!downstreamRepoRoot) {
    throw new Error(
      'fatal: current working directory is not in a git repository (or any parent directories)'
    );
  }

  let stdout = '';
  let stderr = '';
  let patchPath = '';
  let revision = '';
  let failedFiles: Set<string>;
  let conflictsSummary: ConflictsSummary;

  try {
    console.log('🛞  Downloading and installing js-to-lua "main"');
    const currentToolPath = await setupConversionTool('main');
    console.log('✅ ...done!\n');

    console.log(`🛞  Downloading ${config.upstream.repo}`);
    const upstreamPath = await setupUpstreamRepository(
      config.upstream.owner,
      config.upstream.repo,
      config.upstream.primaryBranch
    );
    console.log('✅ ...done!\n');

    const comparisonResponse = await compare(
      config,
      currentToolPath,
      upstreamPath,
      downstreamRepoRoot,
      {
        targetRevision: options.revision,
        outDir: options.outDir,
      },
      jsToLuaOptions
    );
    stdout += comparisonResponse.stdout;
    stderr += comparisonResponse.stderr;
    patchPath = last(comparisonResponse.patches) || '';
    revision = comparisonResponse.revision;
    failedFiles = comparisonResponse.failedFiles;
    conflictsSummary = comparisonResponse.conflictsSummary;
  } catch (e) {
    if (e instanceof Error && errorHasOutput(e) && e.stderr) {
      stderr += e.stderr;
    }
    if (e instanceof Error && errorHasOutput(e) && e.stdout) {
      stdout += e.stdout;
    }

    if (stderr) {
      console.error(stderr);
    }
    if (stdout) {
      console.log(stderr);
    }

    throw e;
  } finally {
    if (options.log) {
      if (stdout) {
        await writeFile(STDOUT_FILENAME, stdout);
      }
      if (stderr) {
        await writeFile(STDERR_FILENAME, stderr);
      }
    }
  }
  return {
    stdout,
    stderr,
    patches: [patchPath],
    revision,
    failedFiles,
    conflictsSummary,
  };
}

function errorHasOutput(e: Error): e is ChildExecException {
  return 'stderr' in e || 'stdout' in e;
}
