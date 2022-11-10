import { checkForNewRelease } from '@roblox/release-tracker';
import { sendReleaseNotification } from '../slack-notifications';
import { getConfig } from './get-config';
import { isPullRequestOpen } from './pr-utils';

export type ScanReleasesOptions = {
  sourceDir: string;
  channel?: string;
};

export async function scanReleases(
  options: ScanReleasesOptions
): Promise<string | void> {
  const config = await getConfig(options.sourceDir);
  const { channel } = options;
  const newRelease = await checkForNewRelease({ config });
  if (newRelease) {
    const { release, config } = newRelease;
    if (!(await isPullRequestOpen(release.tagName, config))) {
      await sendReleaseNotification(
        config.upstream.owner,
        config.upstream.repo,
        release.tagName,
        channel
      );
    }
    return release.tagName;
  }
}
