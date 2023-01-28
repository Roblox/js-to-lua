import { findRepositoryRoot } from '@roblox/version-manager';
import { Octokit } from 'octokit';
import * as path from 'path';
import { GitError, simpleGit } from 'simple-git';
import {
  sendPullRequestFailureNotification,
  sendPullRequestSuccessNotification,
} from '../slack-notifications';

import { getConfig } from './get-config';
import { normalizeTagUser } from './gh-utils';
import { getPullRequestBranchName, isPullRequestOpen } from './pr-utils';
import { GenericOptions } from '../generic-options';
import { ConflictsSummary, sumConflicts } from '@roblox/diff-tool';

export type ApplyPatchOptions = GenericOptions & {
  sourceDir: string;
  patchPath: string;
  revision: string;
  log: boolean;
  channel?: string;
  descriptionData?: {
    failedFiles: Set<string>;
    conflictsSummary: ConflictsSummary;
    pullRequestCC: string[];
  };
};

/**
 * apply patch file to a generated branch, push to remote and send Slack message when done
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
  await git.deleteLocalBranch(id, true).catch(() => {
    // Branch didn't exist, perfect!
  });
  await git.checkoutBranch(id, config.downstream.primaryBranch);

  console.log('applying conflicts patch file...');
  try {
    await git.applyPatch(patchFile.replace('.patch', '-conflicts.patch'));
    console.log('committing files...');
    await git.add('.');
    await git.commit('fast-follow - apply conflicts');
  } catch (e) {
    if (!(e instanceof GitError)) {
      throw e;
    }
    console.log(e.message);
    console.log('There seem to be no conflicts to apply');
  }

  console.log('applying patch file...');
  try {
    await git.applyPatch(patchFile);

    console.log('committing files...');
    await git.add('.');
    await git.commit('fast-follow - apply patch');
  } catch (e) {
    if (!(e instanceof GitError)) {
      throw e;
    }
    console.log(e.message);
    // Stacking the patches fail if there were no conflicts and no deviations.
    // We can use the previous commit as the patch commit in that case.
    console.log(e.message);
    await git.commit('fast-follow - apply patch', { '--amend': null });
  }

  if (!options.allowPublicActions) {
    console.log('🎉 All done, not making a PR or notifying Slack');
    return;
  }

  console.log('pushing branch...');
  await git.push(['--set-upstream', 'origin', id, '--force']);

  console.log('creating PR...');
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  let description = `Fast Follow: Automatic upgrade to ${options.revision}`;

  if (descriptionData) {
    const { conflictsSummary, failedFiles, pullRequestCC } = descriptionData;
    if (Object.keys(conflictsSummary).length) {
      const totalConflicts = sumConflicts('conflicts', conflictsSummary);
      const totalLines = sumConflicts('lines', conflictsSummary);
      description += `\n\n### Summary of ${totalConflicts} conflicts in ${totalLines} lines\n`;
      description +=
        '\nSome files had conflicts that were automatically resolved:\n';
      description += Object.entries(conflictsSummary).map(
        ([filename, summary]) =>
          `- [ ] ${filename}: ${summary.conflicts} (lines: ${summary.lines})`
      );
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
