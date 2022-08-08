import { getLocalRepoConversionConfig } from '@roblox/release-tracker';
import {
  findRepositoryRoot,
  setupConversionTool,
} from '@roblox/version-manager';
import { ExecException } from 'child_process';

export interface CompareOptions {
  outDir?: string;
  pullRequest: boolean;
}

interface ChildExecException extends ExecException {
  stdout?: string;
  stderr?: string;
}

export async function compareDownstreams(options: CompareOptions) {
  const downstreamRepoRoot = await findRepositoryRoot(process.cwd());
  if (!downstreamRepoRoot) {
    throw new Error(
      'fatal: current working directory is not in a git repository (or any parent directories)'
    );
  }

  const conversionConfig = await getLocalRepoConversionConfig(
    'js-to-lua.config.json'
  );

  try {
    console.log('🛞  Downloading and installing js-to-lua "main"');
    await setupConversionTool('main');
    console.log('✅ ...done!\n');
  } catch (e) {
    let stderr: string | undefined;

    if (e instanceof Error && errorHasOutput(e) && e.stderr) {
      stderr = e.stderr;
    }

    if (stderr) {
      console.error(stderr);
    } else {
      console.error(e);
    }
  }

  try {
    const ref = conversionConfig.lastSync.conversionToolVersion;
    console.log(`🛞  Downloading and installing js-to-lua "${ref}"`);
    await setupConversionTool(ref);
    console.log('✅ ...done!');
  } catch (e) {
    let stderr: string | undefined;

    if (e instanceof Error && errorHasOutput(e) && e.stderr) {
      stderr = e.stderr;
    }

    if (stderr) {
      console.error(stderr);
    } else {
      console.error(e);
    }
  }
}

function errorHasOutput(e: Error): e is ChildExecException {
  return 'stderr' in e || 'stdout' in e;
}
