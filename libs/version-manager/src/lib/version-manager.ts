import { simpleGit, CheckRepoActions } from 'simple-git';
import {
  exec as childProcessExec,
  execFile as childProcessExecFile,
} from 'node:child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import { lookpath } from 'lookpath';

const ORG_NAME = 'Roblox';
const REPO_NAME = 'js-to-lua';

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
export async function setupConversionTool(ref: string) {
  const cloneDir = os.tmpdir();
  const installDirName = `js-to-lua-${ref}`;
  const localRepoPath = path.join(cloneDir, installDirName);

  if (fs.existsSync(localRepoPath)) {
    await updateConversionTool(localRepoPath, ref, { fetch: true });
  } else {
    await installConversionTool(localRepoPath, ref);
  }
}

async function installConversionTool(installPath: string, ref: string) {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error(
      'fatal: the GITHUB_TOKEN environment variable must be set to download the conversion tool'
    );
  } else if (!(await lookpath('wasm-pack'))) {
    throw new Error('fatal: wasm-pack must be installed to install js-to-lua');
  }

  try {
    const git = simpleGit();
    const remoteUrl = `https://${process.env.GITHUB_TOKEN}@github.com/${ORG_NAME}/${REPO_NAME}.git`;

    console.log('⬇️  Cloning js-to-lua from github...');
    await git.clone(remoteUrl, installPath);

    await git.cwd(installPath);
    await git.checkout(ref);

    await buildConversionTool(installPath);
  } catch (e) {
    await fs.promises.rm(installPath, { recursive: true, force: true });
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

    console.log('🔨 Building stylua-wasm...');
    await exec('npm run build:stylua-wasm');

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

// IDEA: Copy js-to-lua to parent with SHA1 checksum in the name and then switch
// to the ref being passed as a parameter.
