import { App } from '@slack/bolt';

function createApp() {
  return new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: false,
  });
}

export async function sendReleaseNotification(
  owner: string,
  repo: string,
  tag: string,
  channel: string
): Promise<void> {
  const boltApp = createApp();
  const url = `https://github.com/${owner}/${repo}/releases/tag/${tag}`;
  const text = `Upstream repository '${repo}' has just released version ${tag}, available: ${url}`;

  await boltApp.client.chat.postMessage({ channel, text });
}

export async function sendCommitNotification(
  owner: string,
  repo: string,
  commitHash: string,
  channel: string
): Promise<void> {
  const boltApp = createApp();
  const url = `https://github.com/${owner}/${repo}/tree/${commitHash}`;
  const text = `Upstream repository '${repo}' has new commits, available: ${url}`;

  await boltApp.client.chat.postMessage({ channel, text });
}
