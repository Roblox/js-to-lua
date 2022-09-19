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

export const createUpstreamPath = async (
  filePath: string,
  rootDir_?: string,
  sha?: string
) => {
  const realFilePath = await realpath(filePath);
  const rootDir = await (rootDir_ || inferRootDir(realFilePath));
  const origin = await getRemoteUrl(rootDir);
  if (origin) {
    sha = await (sha || getRev(rootDir));

    const relativeFilePath = relative(rootDir, realFilePath);
    const baseRepoUrl = extractUrl(origin);

    return baseRepoUrl
      ? `${baseRepoUrl}/blob/${sha}/${relativeFilePath}`
      : undefined;
  }
  return;
};

export const inferRootDir = async (filePath: string): Promise<string> => {
  const rootDir = await getTopLevelPath(filePath);
  return rootDir || './';
};
