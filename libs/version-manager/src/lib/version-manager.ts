import * as fs from 'fs';
import { rm } from 'fs/promises';
import {
  exec as childProcessExec,
  execFile as childProcessExecFile,
} from 'node:child_process';
import * as os from 'os';
import * as path from 'path/posix';
import { CheckRepoActions, simpleGit } from 'simple-git';
import * as util from 'util';

const ORG_NAME = 'Roblox';
const REPO_NAME = 'js-to-lua';

const SHA1_REGEX = /^[0-9a-f]{40}$/;

/**
 * Finds the fully-qualified path of the repository root of the repository that
 * the process is currently in, if it is in one at all.
 */
export async function findRepositoryRoot(
  fromPath: string
): Promise<string | void> {
  const git = simpleGit();
  const fullPath = path.resolve(fromPath);

  await git.cwd(fullPath);

  if (!git.checkIsRepo(CheckRepoActions.IN_TREE)) {
    return;
  }

  let cwd = fullPath;

  while (!(await git.checkIsRepo(CheckRepoActions.IS_REPO_ROOT))) {
    const isFilesystemRoot = path.parse(cwd).root === cwd;
    if (isFilesystemRoot) {
      return;
    }

    const currentPath = path.parse(cwd);
    cwd = currentPath.dir;
    await git.cwd(cwd);
  }

  return cwd;
}

/**
 * Installs or updates the existing instance of the conversion tool.
 */
export async function setupConversionTool(ref: string): Promise<string> {
  const cloneDir = os.tmpdir();
  const installDirName = `js-to-lua-${ref}`;
  const localRepoPath = path.join(cloneDir, installDirName);

  if (fs.existsSync(path.join(localRepoPath, '.git/config'))) {
    await updateConversionTool(localRepoPath, ref, { fetch: true });
  } else {
    await installConversionTool(localRepoPath, ref);
  }

  return localRepoPath;
}

async function installConversionTool(installPath: string, ref: string) {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error(
      'fatal: the GITHUB_TOKEN environment variable must be set to download the conversion tool'
    );
  }

  try {
    const remoteUrl = `https://${process.env.GITHUB_TOKEN}@github.com/${ORG_NAME}/${REPO_NAME}.git`;

    console.log('⬇️  Cloning js-to-lua from github...');
    await rm(installPath, { recursive: true, force: true });
    await shallowCloneRepository(remoteUrl, ref, installPath);
    await buildConversionTool(installPath);
  } catch (e) {
    await rm(installPath, { recursive: true, force: true });
    throw e;
  }
}

async function buildConversionTool(installPath: string): Promise<string> {
  const exec = util.promisify(childProcessExec);
  const execFile = util.promisify(childProcessExecFile);
  const originalWorkingDir = process.cwd();

  try {
    process.chdir(installPath);

    console.log('📦 Installing dependencies from npm...');
    await exec('npm i');

    console.log('🔨 Building js-to-lua...');
    await exec('npm run build');
    await exec('npm run build:prod');

    const bundlePath = path.join(
      installPath,
      'dist/apps/convert-js-to-lua/main.js'
    );
    await execFile('node', [bundlePath, '--help']);

    return bundlePath;
  } finally {
    process.chdir(originalWorkingDir);
  }
}

interface UpdateOptions {
  fetch: boolean;
}

async function updateConversionTool(
  installPath: string,
  ref: string,
  options?: UpdateOptions
) {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error(
      'fatal: the GITHUB_TOKEN environment variable must be set to download the conversion tool'
    );
  }

  const git = simpleGit();

  await git.cwd(installPath);

  if (options?.fetch) {
    console.log('⬇️  Fetching updates from github...');
    await git.fetch('origin');
  }

  await git.checkout(ref);
  await buildConversionTool(installPath);
}

/**
 * Clones an upstream repository and checks out the specified ref.
 */
export async function setupUpstreamRepository(
  owner: string,
  name: string,
  ref: string
): Promise<string> {
  const cloneDir = os.tmpdir();
  const installDirName = `${owner}-${name}-${ref}`;
  const localRepoPath = path.join(cloneDir, installDirName);

  if (fs.existsSync(path.join(localRepoPath, '.git/config'))) {
    await updateUpstreamRepository(localRepoPath, ref);
  } else {
    console.log(`⬇️  Cloning upstream repository '${name}' from github...`);
    await rm(localRepoPath, { recursive: true, force: true });
    await cloneUpstreamRepository(owner, name, localRepoPath, ref);
  }

  return localRepoPath;
}

async function cloneUpstreamRepository(
  owner: string,
  name: string,
  repoPath: string,
  ref: string
) {
  const git = simpleGit();

  try {
    const remoteUrl = `https://${process.env.GITHUB_TOKEN}@github.com/${owner}/${name}.git`;

    await git.clone(remoteUrl, repoPath);
    await git.cwd(repoPath);
    await git.checkout(ref);
  } catch (e) {
    await rm(repoPath, { recursive: true, force: true });
    throw e;
  }
}

async function updateUpstreamRepository(repoPath: string, ref: string) {
  const git = simpleGit();

  console.log('⬇️  Fetching updates from github...');
  await git.cwd(repoPath);
  await git.fetch('origin');
  await git.checkout(`origin/${ref}`);
}

async function shallowCloneRepository(
  url: string,
  ref: string,
  directory: string
) {
  const git = simpleGit();

  if (SHA1_REGEX.test(ref)) {
    fs.mkdirSync(directory, { recursive: true });
    await git.cwd(directory);
    await git.init();
    await git.addRemote('origin', url);
    await git.fetch('origin', ref, { '--depth': 1 });
    await git.checkout('FETCH_HEAD');
  } else {
    await git.clone(url, directory, { '--depth': 1 });
    await git.cwd(directory);
    await git.checkout(ref);
  }
}
