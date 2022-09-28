import { getLocalRepoConversionConfig } from '@roblox/release-tracker';
import { findRepositoryRoot } from '@roblox/version-manager';
import { Octokit } from 'octokit';
import * as path from 'path';
import { simpleGit } from 'simple-git';
import {
  sendPullRequestFailureNotification,
  sendPullRequestSuccessNotification,
} from '../slack-notifications';

export type ApplyPatchOptions = {
  sourceDir: string;
  patchPath: string;
  revision: string;
  log: boolean;
  channel: string;
};

/**
 * apply patch file to a generated branch, push to remote and send slack message when done
 */
export async function applyPatch(options: ApplyPatchOptions) {
  const downstreamRepoRoot = await findRepositoryRoot(options.sourceDir);
  const patchFile = path.resolve(options.patchPath);
  if (!downstreamRepoRoot) {
    throw new Error(
      'fatal: current working directory is not in a git repository (or any parent directories)'
    );
  }
  const config = await getLocalRepoConversionConfig(
    path.join(downstreamRepoRoot, 'js-to-lua.config.js')
  );

  const git = simpleGit();

  const id = `fast-follow/${new Date().toISOString().replace(/:|\./g, '-')}`;
  console.log('checking out branch...');
  await git.cwd(downstreamRepoRoot);
  await git.checkout(config.downstream.primaryBranch);
  await git.checkoutBranch(id, config.downstream.primaryBranch);

  console.log('applying patch file...');
  await git.applyPatch(patchFile);

  console.log('commiting files...');
  await git.add('.');
  await git.commit('fast-follow - apply patch');

  console.log('pushing branch...');
  await git.push(['--set-upstream', 'origin', id]);

  console.log('creating PR...');
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const result = await octokit.rest.pulls.create({
    owner: config.downstream.owner,
    repo: config.downstream.repo,
    base: config.downstream.primaryBranch,
    head: id,
    title: `[Fast Follow] - upgrade to ${options.revision}`,
  });

  console.log('sending slack notification...');
  if (result && result.status === 201) {
    await sendPullRequestSuccessNotification(result.data, options.channel);
  } else {
    await sendPullRequestFailureNotification(
      config.downstream.owner,
      config.downstream.repo,
      options.channel
    );
  }

  console.log('Done!!!!');
}
