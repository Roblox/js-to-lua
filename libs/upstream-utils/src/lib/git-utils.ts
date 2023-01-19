import { exec } from 'node:child_process';
import { dirname } from 'path';
import { identity, memoizeWith } from 'ramda';
import { simpleGit } from 'simple-git';
import { promisify } from 'util';

export const getTag = async (rootDir: string) => {
  try {
    const tag = await promisify(exec)(`git -C ${rootDir} describe --tags`, {
      encoding: 'utf-8',
    });

    return tag.stdout.trim() || undefined;
  } catch {
    return;
  }
};

export const getSha = async (rootDir: string) => {
  const git = simpleGit(rootDir);
  const sha = git.revparse(['--short', 'HEAD']);
  return sha;
};

export const getRemoteUrl = memoizeWith(identity, async (rootDir: string) => {
  const git = simpleGit(rootDir);
  const config = await git.getConfig('remote.origin.url');

  return config.value || undefined;
});

export const getTopLevelPath = async (filePath: string) => {
  const git = simpleGit(dirname(filePath));

  try {
    const topLevel = await git.revparse('--show-toplevel');
    return topLevel.trim();
  } catch {
    return;
  }
};

export const commitFiles = async (
  rootDir: string,
  files: string | string[],
  message: string
) => {
  const git = simpleGit(rootDir);

  await git.add(files);
  await git.commit(message);
  console.log('Committed: ', message);
};

/**
 * Manual override for simple-gits patch method
 *
 * This version allows you to actually stack patches. Allowing to see whether
 * our latest patch would work on top of earlier (e.g., conflicts) patches.
 */
export const applyPatch = async (
  rootDir: string,
  patchPath: string | string[],
  options?: { check: boolean }
): Promise<string> => {
  const { stdout, stderr } = await promisify(exec)(
    `cat ${
      typeof patchPath === 'string' ? patchPath : patchPath.join(' ')
    } | git apply${options?.check ? ' --check' : ''}`,
    { cwd: rootDir }
  );
  return stdout + stderr;
};
