import { JsToLuaOptions } from '@roblox/diff-tool';
import { applyPatch } from './apply-patch';
import { compareSinceLastSync } from './compare';
import { getConfig } from './get-config';
import { isPullRequestOpen } from './pr-utils';
import { scanReleases } from './scan-releases';
import { GenericOptions } from '../generic-options';

export type UpgradeOptions = GenericOptions & {
  revision?: string;
  channel?: string;
  sourceDir: string;
  outDir?: string;
  log: boolean;
  pullRequestCC: string[];
};

/**
 * apply upgrade a given source directory to the given upstream revision (or latest if revision not provided)
 */
export const upgrade = async (
  {
    channel,
    sourceDir,
    outDir,
    log,
    revision: targetRev,
    pullRequestCC,
    allowPublicActions,
  }: UpgradeOptions,
  jsToLuaOptions: JsToLuaOptions
) => {
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

  const { patches, failedFiles, conflictsSummary } = await compareSinceLastSync(
    {
      sourceDir,
      outDir,
      revision,
      log,
    },
    jsToLuaOptions
  );

  const descriptionData = {
    failedFiles,
    conflictsSummary,
    pullRequestCC,
  };

  console.log('Conversion completed.');

  return applyPatch({
    sourceDir,
    patchPath: patches[patches.length - 1],
    revision,
    log,
    channel,
    descriptionData,
    allowPublicActions,
  });
};
