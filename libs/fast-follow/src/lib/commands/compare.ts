import { compare } from '@roblox/diff-tool';
import { getLocalRepoConversionConfig } from '@roblox/release-tracker';
import {
  findRepositoryRoot,
  setupConversionTool,
  setupUpstreamRepository,
} from '@roblox/version-manager';
import { ExecException } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const STDOUT_FILENAME = 'fast-follow.stdout.log';
const STDERR_FILENAME = 'fast-follow.stderr.log';

export interface CompareOptions {
  sourceDir: string;
  outDir?: string;
  revision?: string;
  pullRequest: boolean;
  log: boolean;
}

interface ChildExecException extends ExecException {
  stdout?: string;
  stderr?: string;
}

export async function compareSinceLastSync(options: CompareOptions) {
  const downstreamRepoRoot = await findRepositoryRoot(options.sourceDir);
  if (!downstreamRepoRoot) {
    throw new Error(
      'fatal: current working directory is not in a git repository (or any parent directories)'
    );
  }

  let stdout = '';
  let stderr = '';

  try {
    const conversionConfig = await getLocalRepoConversionConfig(
      path.join(downstreamRepoRoot, 'js-to-lua.config.js')
    );

    console.log('🛞  Downloading and installing js-to-lua "main"');
    const currentToolPath = await setupConversionTool('main');
    console.log('✅ ...done!\n');

    console.log(`🛞  Downloading ${conversionConfig.upstream.repo}`);
    const upstreamPath = await setupUpstreamRepository(
      conversionConfig.upstream.owner,
      conversionConfig.upstream.repo,
      conversionConfig.upstream.primaryBranch
    );
    console.log('✅ ...done!\n');

    const comparisonResponse = await compare(
      conversionConfig,
      currentToolPath,
      upstreamPath,
      downstreamRepoRoot,
      { targetRevision: options.revision, outDir: options.outDir }
    );
    stdout += comparisonResponse.stdout;
    stderr += comparisonResponse.stderr;
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
}

function errorHasOutput(e: Error): e is ChildExecException {
  return 'stderr' in e || 'stdout' in e;
}
