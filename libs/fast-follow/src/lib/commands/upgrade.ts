import { applyPatch } from './apply-patch';
import { compareSinceLastSync } from './compare';
import { getConfig } from './get-config';
import { isPullRequestOpen } from './pr-utils';
import { scanReleases } from './scan-releases';

export type UpgradeOptions = {
  revision?: string;
  channel?: string;
  sourceDir: string;
  outDir?: string;
  log: boolean;
  babelConfig?: string;
  babelTransformConfig?: string;
};

/**
 * apply upgrade a given source directory to the given upstream revision (or latest if revision not provided)
 */
export const upgrade = async ({
  channel,
  sourceDir,
  outDir,
  log,
  revision: targetRev,
  babelConfig,
  babelTransformConfig,
}: UpgradeOptions) => {
  const config = await getConfig(sourceDir);

  let revision = targetRev;

  if (!revision) {
    console.log('Scanning releases...');
    revision = (await scanReleases({ sourceDir, channel })) || undefined;
  }

  if (!revision) {
    return console.log('Conversion up to date.');
  }

  if (await isPullRequestOpen(revision, config)) {
    return console.log(
      `Fast Follow PR for ${revision} already exists. Skipping next steps`
    );
  }

  console.log(`New release found: ${revision}. Starting conversion...`);

  const { patchPath, failedFiles, conflictsSummary } =
    await compareSinceLastSync({
      sourceDir,
      outDir,
      revision,
      log,
      babelConfig,
      babelTransformConfig,
    });

  const descriptionData = {
    failedFiles,
    conflictsSummary,
  };

  console.log('Conversion completed.');

  return applyPatch({
    sourceDir,
    patchPath,
    revision,
    log,
    channel,
    descriptionData,
  });
};
