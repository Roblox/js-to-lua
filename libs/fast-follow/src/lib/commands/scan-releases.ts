import { checkForNewRelease, ConversionConfig } from '@roblox/release-tracker';
import { sendReleaseNotification } from '../slack-notifications';

export async function scanReleases(options: {
  config: ConversionConfig;
  channel?: string;
}): Promise<string | void> {
  const { config, channel } = options;
  const newRelease = await checkForNewRelease({ config });
  if (newRelease) {
    const { release, config } = newRelease;
    await sendReleaseNotification(
      config.upstream.owner,
      config.upstream.repo,
      release.tagName,
      channel
    );
    return release.tagName;
  }
}
