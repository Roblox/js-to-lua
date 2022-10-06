import { relative } from 'path';
import { realpath } from 'fs/promises';
import { getRemoteUrl, getSha, getTag, getTopLevelPath } from './git-utils';

const REGEX_SSH = /^git@github.com:(?<owner>[\w-]+)\/(?<repo>[\w-]+)(\.git)?$/;
const REGEX_HTTPS =
  /^https:\/\/github.com\/(?<owner>[\w-]+)\/(?<repo>[\w-]+)(\.git)?$/;

export const extractUrl = (remoteUrl: string): string | undefined => {
  const githubMatch = REGEX_HTTPS.exec(remoteUrl) || REGEX_SSH.exec(remoteUrl);
  if (githubMatch) {
    const owner = githubMatch.groups?.['owner'];
    const repo = githubMatch.groups?.['repo'];

    if (owner && repo) {
      return `https://github.com/${owner}/${repo}`;
    }
  }

  return;
};

export const getRev = async (rootDir: string) => {
  const tag = await getTag(rootDir);
  return tag ? tag : getSha(rootDir);
};

const hasRemoteUrlProp = (
  obj: Record<string, unknown>
): obj is { remoteUrl: string } =>
  Object.prototype.hasOwnProperty.call(obj, 'remoteUrl') &&
  typeof obj['remoteUrl'] === 'string' &&
  !!obj['remoteUrl'];

type UpstreamPathOptions =
  | {
      rootDir?: string;
      sha?: string;
    }
  | {
      remoteUrl: string;
      sha: string;
      rootDir: string;
    };
export const createUpstreamPath = async (
  filePath: string,
  options: UpstreamPathOptions
) => {
  const info = await getUpstreamPathInfo(filePath, options);
  return info?.baseRepoUrl
    ? `${info.baseRepoUrl}/blob/${info.sha}/${info.relativeFilePath}`
    : undefined;
};

const getUpstreamPathInfo = async (
  filePath: string,
  options: UpstreamPathOptions
) => {
  const realFilePath = await realpath(filePath);
  if (hasRemoteUrlProp(options)) {
    const { remoteUrl, sha, rootDir } = options;
    const relativeFilePath = relative(rootDir, realFilePath);
    const baseRepoUrl = extractUrl(remoteUrl);

    return { baseRepoUrl, sha, relativeFilePath };
  } else {
    const { rootDir: rootDir_, sha: sha_ } = options;
    const rootDir = await (rootDir_ || inferRootDir(realFilePath));
    const origin = await getRemoteUrl(rootDir);
    if (origin) {
      const sha = await (sha_ || getRev(rootDir));

      const relativeFilePath = relative(rootDir, realFilePath);
      const baseRepoUrl = extractUrl(origin);

      return { baseRepoUrl, sha, relativeFilePath };
    }
  }
  return;
};

export const inferRootDir = async (filePath: string): Promise<string> => {
  const rootDir = await getTopLevelPath(filePath);
  return rootDir || './';
};
