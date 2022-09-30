import { checkForNewCommits, ConversionConfig } from '@roblox/release-tracker';
import { sendCommitNotification } from '../slack-notifications';

export async function scanCommits(options: {
  config: ConversionConfig;
  channel: string;
}) {
  const { config, channel } = options;
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
