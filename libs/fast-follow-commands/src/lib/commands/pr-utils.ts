import { ConversionConfig } from '@roblox/release-tracker';
import { Octokit } from 'octokit';

export async function isPullRequestOpen(
  revision: string,
  config: ConversionConfig
): Promise<boolean> {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const existingPRs = await octokit.rest.pulls.list({
    owner: config.downstream.owner,
    repo: config.downstream.repo,
    base: config.downstream.primaryBranch,
    head: getPullRequestBranchName(revision),
    state: 'open',
  });

  const data = existingPRs.data.filter(
    (pr) =>
      pr.head.ref === getPullRequestBranchName(revision) &&
      pr.base.ref === config.downstream.primaryBranch &&
      pr.state === 'open'
  );

  return !!data.length;
}

export function getPullRequestBranchName(revision: string) {
  return `fast-follow/${revision.replace(/:|\./g, '-')}`;
}
