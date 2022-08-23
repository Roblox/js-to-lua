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

export interface CompareOptions {
  sourceDir: string;
  outDir?: string;
  pullRequest: boolean;
}

interface ChildExecException extends ExecException {
  stdout?: string;
  stderr?: string;
}

export async function compareDownstreams(options: CompareOptions) {
  const downstreamRepoRoot = await findRepositoryRoot(options.sourceDir);
  if (!downstreamRepoRoot) {
    throw new Error(
      'fatal: current working directory is not in a git repository (or any parent directories)'
    );
  }

  const conversionConfig = await getLocalRepoConversionConfig(
    path.join(downstreamRepoRoot, 'js-to-lua.config.json')
  );

  try {
    console.log('🛞  Downloading and installing js-to-lua "main"');
    const currentToolPath = await setupConversionTool('main');
    console.log('✅ ...done!\n');

    const ref = conversionConfig.lastSync.conversionToolVersion;
    console.log(`🛞  Downloading and installing js-to-lua "${ref}"`);
    const previousToolPath = await setupConversionTool(ref);
    console.log('✅ ...done!\n');

    const upstreamRef = conversionConfig.lastSync.ref;
    console.log(
      `🛞  Downloading ${conversionConfig.upstream.repo} "${upstreamRef}"`
    );
    const upstreamPath = await setupUpstreamRepository(
      conversionConfig.upstream.owner,
      conversionConfig.upstream.repo,
      conversionConfig.upstream.primaryBranch
    );
    console.log('✅ ...done!\n');

    const patch = await compare(
      conversionConfig,
      previousToolPath,
      currentToolPath,
      upstreamPath,
      downstreamRepoRoot
    );
    await fs.promises.writeFile('./fast-follow.patch', patch);
  } catch (e) {
    let stderr: string | undefined;
    let stdout: string | undefined;

    if (e instanceof Error && errorHasOutput(e) && e.stderr) {
      stderr = e.stderr;
    }
    if (e instanceof Error && errorHasOutput(e) && e.stdout) {
      stdout = e.stdout;
    }

    if (stderr) {
      console.error(stderr);
    } else {
      console.error(e);
    }

    if (stdout) {
      console.log(stdout);
    }
  }
}

function errorHasOutput(e: Error): e is ChildExecException {
  return 'stderr' in e || 'stdout' in e;
}
