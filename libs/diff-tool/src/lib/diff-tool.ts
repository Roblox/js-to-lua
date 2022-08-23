import { simpleGit, CheckRepoActions, GitError } from 'simple-git';
import { execFile as childProcessExecFile } from 'node:child_process';
import { ConversionConfig } from '@roblox/release-tracker';
import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs';
import * as process from 'process';

const CONVERSION_OUTPUT_DIR = 'output';

export async function convert(
  conversionConfig: ConversionConfig,
  toolPath: string,
  destinationBranch: string,
  upstreamPath: string,
  downstreamPath: string,
  branchName: string
): Promise<string | void> {
  const execFile = util.promisify(childProcessExecFile);
  const git = simpleGit();

  const originalDir = process.cwd();
  const fullToolPath = path.join(
    path.resolve(toolPath),
    'dist/apps/convert-js-to-lua/main.js'
  );
  const fullSourcePath = path.resolve(upstreamPath);
  const fullOutputPath = path.resolve(
    path.join(upstreamPath, CONVERSION_OUTPUT_DIR)
  );

  try {
    await git.cwd(fullSourcePath);

    if (!git.checkIsRepo(CheckRepoActions.IN_TREE)) {
      throw new Error(
        `Unable to run conversion for '${upstreamPath}': destination directory is not a git repository`
      );
    } else if (conversionConfig.upstream.patterns.length < 1) {
      throw new Error(
        `Unable to run conversion for '${upstreamPath}': no source patterns are specified in the downstream conversion config`
      );
    }

    await git.checkout(conversionConfig.upstream.primaryBranch);

    const shortRef = (
      await git.revparse(conversionConfig.upstream.primaryBranch)
    ).substring(0, 7);

    process.chdir(fullSourcePath);

    console.log(`🔨 Converting sources to Luau...`);
    await execFile(
      'node',
      [fullToolPath, '-o', CONVERSION_OUTPUT_DIR, '-i'].concat(
        conversionConfig.upstream.patterns
      ),
      { maxBuffer: Infinity }
    );

    await git.cwd(downstreamPath);
    if (!git.checkIsRepo(CheckRepoActions.IN_TREE)) {
      throw new Error(
        `Unable to commit transpiled sources into '${downstreamPath}': destination directory is not a git repository`
      );
    }

    try {
      await git.deleteLocalBranch(destinationBranch, true);
    } catch (e) {
      if (!(e instanceof GitError)) {
        throw e;
      }
    }

    // Merge in transpiled sources and commit them.
    console.log('✏️  Committing converted sources to git...');
    recursiveSync(fullOutputPath, downstreamPath);
    await git.checkoutBranch(destinationBranch, branchName);
    await git.add('./*');
    await git.commit(`port: sync with upstream ref ${shortRef}`);
    console.log('✅ ...done!\n');

    return fullOutputPath;
  } catch (e) {
    await fs.promises.rm(fullOutputPath, { recursive: true, force: true });
    throw e;
  } finally {
    process.chdir(originalDir);
  }
}

export async function compare(
  conversionConfig: ConversionConfig,
  olderToolPath: string,
  newerToolPath: string,
  upstreamPath: string,
  downstreamPath: string
): Promise<string> {
  const git = simpleGit();

  await git.cwd(downstreamPath);
  await git.checkout(conversionConfig.downstream.primaryBranch);

  await convert(
    conversionConfig,
    olderToolPath,
    'previous-revision',
    upstreamPath,
    downstreamPath,
    conversionConfig.downstream.primaryBranch
  );
  await convert(
    conversionConfig,
    newerToolPath,
    'current-revision',
    upstreamPath,
    downstreamPath,
    'previous-revision'
  );

  return git.raw(['format-patch', '-1', 'HEAD', '--stdout']);
}

/**
 * Recursively merge the contents of one directory into another.
 */
function recursiveSync(src: string, dest: string): void {
  const srcExists = fs.existsSync(src);
  if (!srcExists) {
    throw new Error(`failed to copy '${src}' as it does not exist`);
  }

  const srcStats = srcExists && fs.statSync(src);
  const srcIsDirectory = srcStats && srcStats.isDirectory();

  const destExists = fs.existsSync(src);
  const destStats = destExists && fs.statSync(src);
  const destIsDirectory = destStats && destStats.isDirectory();

  if (srcIsDirectory) {
    if (!destIsDirectory) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach((childItemName) => {
      recursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.mkdirSync(path.join(dest, '..'), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}
