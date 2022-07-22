import { checkForNewCommits } from '@roblox/release-tracker';
import { sendCommitNotification } from '../slack-notifications';

export async function scanCommits(
  owner: string,
  repo: string,
  channel: string
) {
  const newCommits = await checkForNewCommits(owner, repo);
  if (newCommits) {
    const { commitHash, config } = newCommits;

    await sendCommitNotification(
      config.upstream.owner,
      config.upstream.repo,
      commitHash,
      channel
    );
  }
}
