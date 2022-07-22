import { checkForNewRelease } from '@roblox/release-tracker';
import { sendReleaseNotification } from '../slack-notifications';

export async function scanReleases(
  owner: string,
  repo: string,
  channel: string
) {
  const newRelease = await checkForNewRelease(owner, repo);
  if (newRelease) {
    const { release, config } = newRelease;

    await sendReleaseNotification(
      config.upstream.owner,
      config.upstream.repo,
      release.tagName,
      channel
    );
  }
}
