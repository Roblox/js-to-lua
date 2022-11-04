import { checkForNewCommits } from '@roblox/release-tracker';
import { sendCommitNotification } from '../slack-notifications';
import { getConfig } from './get-config';

export type ScanCommitsOptions = {
  sourceDir: string;
  channel?: string;
};

export async function scanCommits(options: ScanCommitsOptions) {
  const { sourceDir, channel } = options;
  const config = await getConfig(sourceDir);
  const newCommits = await checkForNewCommits({ config });
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
