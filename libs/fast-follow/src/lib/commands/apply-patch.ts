import { findRepositoryRoot } from '@roblox/version-manager';
import { Octokit } from 'octokit';
import * as path from 'path';
import { simpleGit } from 'simple-git';
import {
  sendPullRequestFailureNotification,
  sendPullRequestSuccessNotification,
} from '../slack-notifications';
import { getConfig } from './get-config';
import { normalizeTagUser } from './gh-utils';
import { getPullRequestBranchName, isPullRequestOpen } from './pr-utils';

export type ApplyPatchOptions = {
  sourceDir: string;
  patchPath: string;
  revision: string;
  log: boolean;
  channel?: string;
  descriptionData?: {
    failedFiles: Set<string>;
    conflictsSummary: { [key: string]: number };
    pullRequestCC: string[];
  };
};

const DEFAULT_CONVERSION_OUTPUT_DIR = 'output';

/**
 * apply patch file to a generated branch, push to remote and send slack message when done
 */
export async function applyPatch(options: ApplyPatchOptions) {
  const { sourceDir, descriptionData } = options;

  const config = await getConfig(sourceDir);

  if (await isPullRequestOpen(options.revision, config)) {
    console.log(
      `Fast Follow PR for ${options.revision} already exists. Skipping next steps`
    );
    return;
  }

  const downstreamRepoRoot = await findRepositoryRoot(options.sourceDir);
  const patchFile = path.resolve(options.patchPath);
  if (!downstreamRepoRoot) {
    throw new Error(
      'fatal: current working directory is not in a git repository (or any parent directories)'
    );
  }

  const git = simpleGit();
  const id = getPullRequestBranchName(options.revision);

  console.log('checking out branch...');
  await git.cwd(downstreamRepoRoot);
  await git.checkout(config.downstream.primaryBranch);
  await git.deleteLocalBranch(id).catch(() => {
    /* do nothing */
  });
  await git.checkoutBranch(id, config.downstream.primaryBranch);

  console.log('applying patch file...');
  await git.applyPatch(patchFile);

  console.log('commiting files...');
  await git.add('.');
  await git.commit('fast-follow - apply patch');

  console.log('pushing branch...');
  await git.push(['--set-upstream', 'origin', id, '--force']);

  console.log('creating PR...');
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  let description = `Fast Follow: Automatic upgrade to ${options.revision}`;
  if (descriptionData) {
    const { conflictsSummary, failedFiles, pullRequestCC } = descriptionData;
    if (Object.keys(conflictsSummary).length) {
      description +=
        '\n\nSome files had conflicts that were automatically resolved:\n';
      description += Object.keys(conflictsSummary)
        .map((key) => {
          const filename = key.slice(DEFAULT_CONVERSION_OUTPUT_DIR.length + 1);
          return `- [ ] ${filename}: ${conflictsSummary[key]}`;
        })
        .join('\n');
    }

    if (failedFiles.size) {
      description +=
        '\n\nPatch files could not be applied to some files and were skipped:\n';
      description += [...failedFiles].map((file) => `- [ ] ${file}`).join('\n');
    }

    if (pullRequestCC.length) {
      description += `\n\nCC: ${pullRequestCC
        .map(normalizeTagUser)
        .filter(Boolean)
        .join(' ')}`;
    }
  }

  const result = await octokit.rest.pulls.create({
    owner: config.downstream.owner,
    repo: config.downstream.repo,
    base: config.downstream.primaryBranch,
    head: id,
    title: `[Fast Follow] - upgrade to ${options.revision}`,
    body: description,
  });

  console.log('sending slack notification...');
  if (result && result.status === 201) {
    await sendPullRequestSuccessNotification(
      { htmlUrl: result.data.html_url, title: result.data.title },
      options.channel
    );
  } else {
    await sendPullRequestFailureNotification(
      config.downstream.owner,
      config.downstream.repo,
      options.channel
    );
  }

  console.log('Done!!!!');
}
