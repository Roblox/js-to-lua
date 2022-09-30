import { getLocalRepoConversionConfig } from '@roblox/release-tracker';
import { findRepositoryRoot } from '@roblox/version-manager';
import * as path from 'path';

export async function getConfig(sourceDir: string) {
  const downstreamRepoRoot = await findRepositoryRoot(sourceDir);
  if (!downstreamRepoRoot) {
    throw new Error(
      'fatal: current working directory is not in a git repository (or any parent directories)'
    );
  }
  return getLocalRepoConversionConfig(
    path.join(downstreamRepoRoot, 'js-to-lua.config.js')
  );
}
