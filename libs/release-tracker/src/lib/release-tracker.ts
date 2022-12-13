import { ConversionConfig, parseConversionConfig } from './conversion-config';
import { getLatestRepoCommit } from './get-latest-repo-commit';
import { getLatestRepoRelease, Release } from './get-latest-repo-release';
import { getRepoConversionConfig } from './get-repo-conversion-config';

export async function getLocalRepoConversionConfig(
  configPath: string
): Promise<ConversionConfig> {
  let config;
  try {
    config = await import(/* webpackIgnore: true */ configPath);
  } catch {
    throw new Error(
      'fatal: js-to-lua.config.js needs to be defined in the root of the repository that fast-follow runs on'
    );
  }
  const parsedConfig = parseConversionConfig(config);
  if (!parsedConfig) {
    throw new Error(
      'fatal: js-to-lua.config.js is not valid. Please see fast-follow docs for correct format'
    );
  }
  return parsedConfig;
}

export async function checkForNewRelease(options: {
  config: ConversionConfig;
}): Promise<{ release: Release; config: ConversionConfig } | null> {
  const localConfig = options.config;
  const repoConfig = await getRepoConversionConfig({
    owner: localConfig.upstream.owner,
    repo: localConfig.upstream.repo,
  });
  const config = repoConfig || localConfig;

  const release = await getLatestRepoRelease(
    config.upstream.owner,
    config.upstream.repo,
    config.releasePattern
  );
  if (release) {
    if (release.tagCommit.oid !== config.lastSync.ref) {
      return { release, config };
    }
  }

  return null;
}

export async function checkForNewCommits(options: {
  config: ConversionConfig;
}): Promise<{ commitHash: string; config: ConversionConfig } | null> {
  const localConfig = options.config;
  const repoConfig = await getRepoConversionConfig({
    owner: localConfig.upstream.owner,
    repo: localConfig.upstream.repo,
  });
  const config = repoConfig || localConfig;

  const latestCommit = await getLatestRepoCommit(
    config.upstream.owner,
    config.upstream.repo
  );
  const commitHash = latestCommit.repository.object.oid;

  if (commitHash && commitHash !== config.lastSync.ref) {
    return { commitHash, config };
  }

  return null;
}
