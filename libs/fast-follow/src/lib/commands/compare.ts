import { compare } from '@roblox/diff-tool';
import { ComparisonResponse } from '@roblox/diff-tool';
import { ConversionConfig } from '@roblox/release-tracker';
import {
  findRepositoryRoot,
  setupConversionTool,
  setupUpstreamRepository,
} from '@roblox/version-manager';
import { ExecException } from 'child_process';
import * as fs from 'fs';

const STDOUT_FILENAME = 'fast-follow.stdout.log';
const STDERR_FILENAME = 'fast-follow.stderr.log';

export interface CompareOptions {
  log: boolean;
  outDir?: string;
  revision?: string;
  sourceDir: string;
  config: ConversionConfig;
}

interface ChildExecException extends ExecException {
  stdout?: string;
  stderr?: string;
}

export async function compareSinceLastSync(
  options: CompareOptions
): Promise<ComparisonResponse> {
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
  let conflictsSummary: { [key: string]: number };

  try {
    console.log('🛞  Downloading and installing js-to-lua "main"');
    const currentToolPath = await setupConversionTool('main');
    console.log('✅ ...done!\n');

    console.log(`🛞  Downloading ${options.config.upstream.repo}`);
    const upstreamPath = await setupUpstreamRepository(
      options.config.upstream.owner,
      options.config.upstream.repo,
      options.config.upstream.primaryBranch
    );
    console.log('✅ ...done!\n');

    const comparisonResponse = await compare(
      options.config,
      currentToolPath,
      upstreamPath,
      downstreamRepoRoot,
      { targetRevision: options.revision, outDir: options.outDir }
    );
    stdout += comparisonResponse.stdout;
    stderr += comparisonResponse.stderr;
    patchPath = comparisonResponse.patchPath;
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
        await fs.promises.writeFile(STDOUT_FILENAME, stdout);
      }
      if (stderr) {
        await fs.promises.writeFile(STDERR_FILENAME, stderr);
      }
    }
  }
  return {
    stdout,
    stderr,
    patchPath,
    revision,
    failedFiles,
    conflictsSummary,
  };
}

function errorHasOutput(e: Error): e is ChildExecException {
  return 'stderr' in e || 'stdout' in e;
}
