import { getLocalRepoConversionConfig } from '@roblox/release-tracker';
import { findRepositoryRoot } from '@roblox/version-manager';
import * as path from 'path';
import { identity, memoizeWith } from 'ramda';

export const getConfig = memoizeWith(identity, async (sourceDir: string) => {
  const downstreamRepoRoot = await findRepositoryRoot(sourceDir);
  if (!downstreamRepoRoot) {
    throw new Error(
      'fatal: current working directory is not in a git repository (or any parent directories)'
    );
  }
  return getLocalRepoConversionConfig(
    path.join(downstreamRepoRoot, 'js-to-lua.config.js')
  );
});
