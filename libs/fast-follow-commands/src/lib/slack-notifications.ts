import { App } from '@slack/bolt';

const requiredEnvVars = [
  'SLACK_BOT_TOKEN',
  'SLACK_SIGNING_SECRET',
  'SLACK_APP_TOKEN',
];

function createApp() {
  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
  if (missingVars.length) {
    throw new Error(`Missing env variables: ${missingVars.join(', ')}`);
  }
  return new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: false,
  });
}

async function sendSlackMessage(opts: {
  channel?: string;
  text: string;
}): Promise<void> {
  const { channel, text } = opts;
  if (channel) {
    const boltApp = createApp();
    await boltApp.client.chat.postMessage({ channel, text });
  } else {
    console.log('Slack channel not set');
    console.log(text);
  }
}

export function sendReleaseNotification(
  owner: string,
  repo: string,
  tag: string,
  channel?: string
): Promise<void> {
  const url = `https://github.com/${owner}/${repo}/releases/tag/${tag}`;
  const text = `Upstream repository '${repo}' has just released version ${tag}, available: ${url}`;
  return sendSlackMessage({ channel, text });
}

export function sendCommitNotification(
  owner: string,
  repo: string,
  commitHash: string,
  channel?: string
): Promise<void> {
  const url = `https://github.com/${owner}/${repo}/tree/${commitHash}`;
  const text = `Upstream repository '${repo}' has new commits, available: ${url}`;
  return sendSlackMessage({ channel, text });
}

export function sendPullRequestSuccessNotification(
  data: {
    htmlUrl: string;
    title: string;
  },
  channel?: string
): Promise<void> {
  const text = `An automated Pull Request has been opened: <${data.htmlUrl}|${data.title}>`;
  return sendSlackMessage({ channel, text });
}

export function sendPullRequestFailureNotification(
  owner: string,
  repo: string,
  channel?: string
): Promise<void> {
  const url = `https://github.com/${owner}/${repo}`;
  const text = `Failed to create automated PR for ${url}`;
  return sendSlackMessage({ channel, text });
}
