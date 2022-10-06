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
};

/**
 * apply upgrade a given source directory to the given upstream revision (or latest if revision not provided)
 */
export const upgrade = async ({
  channel,
  revision: targetRev,
  sourceDir,
  outDir,
  log,
}: UpgradeOptions) => {
  const config = await getConfig(sourceDir);

  let revision = targetRev;

  if (!revision) {
    console.log('Scanning releases...');
    revision = (await scanReleases({ sourceDir, channel })) || undefined;
  }

  if (!revision) {
    console.log('Conversion up to date.');
    return;
  }

  if (await isPullRequestOpen(revision, config)) {
    console.log(
      `Fast Follow PR for ${revision} already exists. Skipping next steps`
    );
    return;
  }

  console.log(`New release found: ${revision}. Starting conversion...`);

  const { patchPath, failedFiles, conflictsSummary } =
    await compareSinceLastSync({
      sourceDir,
      outDir,
      revision,
      log,
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
