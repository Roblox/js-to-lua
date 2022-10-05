import * as Bolt from '@slack/bolt';
import {
  sendCommitNotification,
  sendPullRequestFailureNotification,
  sendPullRequestSuccessNotification,
  sendReleaseNotification,
} from './slack-notifications';
describe('Fast-follow: slack notifications', () => {
  const originalEnv = process.env;

  const postMessageSpy = jest.fn();
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {
    /* Do nothing*/
  });

  beforeAll(() => {
    jest.spyOn(Bolt, 'App').mockImplementation(() => {
      return {
        client: {
          chat: {
            postMessage: (opts: unknown) => postMessageSpy(opts),
          },
        },
      } as Bolt.App;
    });
  });

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('sendReleaseNotification', () => {
    it('Should print to the console and not attempt to send a slack message if channel is not set', async () => {
      await sendReleaseNotification('owner', 'repo', 'tag');
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      expect(consoleSpy).toHaveBeenCalledWith('Slack channel not set');
      expect(consoleSpy).toHaveBeenCalledWith(
        `Upstream repository 'repo' has just released version tag, available: https://github.com/owner/repo/releases/tag/tag`
      );
    });

    it('Should send a slack message if channel and env are set', async () => {
      process.env.SLACK_BOT_TOKEN = 'bot_token';
      process.env.SLACK_SIGNING_SECRET = 'secret';
      process.env.SLACK_APP_TOKEN = 'app_token';
      await sendReleaseNotification('owner', 'repo', 'tag', 'channel');
      expect(postMessageSpy).toHaveBeenCalledTimes(1);
      expect(postMessageSpy).toHaveBeenCalledWith({
        channel: 'channel',
        text: `Upstream repository 'repo' has just released version tag, available: https://github.com/owner/repo/releases/tag/tag`,
      });
    });

    it('Should throw if channel is set but env.SLACK_BOT_TOKEN is missing', async () => {
      process.env.SLACK_BOT_TOKEN = undefined;
      process.env.SLACK_SIGNING_SECRET = 'secret';
      process.env.SLACK_APP_TOKEN = 'app_token';

      expect(
        sendReleaseNotification('owner', 'repo', 'tag', 'channel')
      ).rejects.toThrowError('Missing env variables: SLACK_BOT_TOKEN');
    });

    it('Should throw if channel is set but env.SLACK_SIGNING_SECRET is missing', async () => {
      process.env.SLACK_BOT_TOKEN = 'bot_token';
      process.env.SLACK_SIGNING_SECRET = undefined;
      process.env.SLACK_APP_TOKEN = 'app_token';

      expect(
        sendReleaseNotification('owner', 'repo', 'tag', 'channel')
      ).rejects.toThrowError('Missing env variables: SLACK_SIGNING_SECRET');
    });

    it('Should throw if channel is set but env.SLACK_APP_TOKEN is missing', async () => {
      process.env.SLACK_BOT_TOKEN = 'bot_token';
      process.env.SLACK_SIGNING_SECRET = 'secret';
      process.env.SLACK_APP_TOKEN = undefined;

      expect(
        sendReleaseNotification('owner', 'repo', 'tag', 'channel')
      ).rejects.toThrowError('Missing env variables: SLACK_APP_TOKEN');
    });

    it('Should throw if channel is set but multiple env vars are missing', async () => {
      process.env.SLACK_BOT_TOKEN = undefined;
      process.env.SLACK_SIGNING_SECRET = undefined;
      process.env.SLACK_APP_TOKEN = undefined;
      expect(
        sendReleaseNotification('owner', 'repo', 'tag', 'channel')
      ).rejects.toThrowError(
        'Missing env variables: SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN'
      );
    });
  });

  describe('sendCommitNotification', () => {
    it('Should print to the console and not attempt to send a slack message if channel is not set', async () => {
      await sendCommitNotification('owner', 'repo', 'hash');
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      expect(consoleSpy).toHaveBeenCalledWith('Slack channel not set');
      expect(consoleSpy).toHaveBeenCalledWith(
        `Upstream repository 'repo' has new commits, available: https://github.com/owner/repo/tree/hash`
      );
    });

    it('Should send a slack message if channel and env are set', async () => {
      process.env.SLACK_BOT_TOKEN = 'bot_token';
      process.env.SLACK_SIGNING_SECRET = 'secret';
      process.env.SLACK_APP_TOKEN = 'app_token';
      await sendCommitNotification('owner', 'repo', 'hash', 'channel');
      expect(postMessageSpy).toHaveBeenCalledTimes(1);
      expect(postMessageSpy).toHaveBeenCalledWith({
        channel: 'channel',
        text: `Upstream repository 'repo' has new commits, available: https://github.com/owner/repo/tree/hash`,
      });
    });

    it('Should throw if channel is set but env.SLACK_BOT_TOKEN is missing', async () => {
      process.env.SLACK_BOT_TOKEN = undefined;
      process.env.SLACK_SIGNING_SECRET = 'secret';
      process.env.SLACK_APP_TOKEN = 'app_token';

      expect(
        sendCommitNotification('owner', 'repo', 'hash', 'channel')
      ).rejects.toThrowError('Missing env variables: SLACK_BOT_TOKEN');
    });

    it('Should throw if channel is set but env.SLACK_SIGNING_SECRET is missing', async () => {
      process.env.SLACK_BOT_TOKEN = 'bot_token';
      process.env.SLACK_SIGNING_SECRET = undefined;
      process.env.SLACK_APP_TOKEN = 'app_token';

      expect(
        sendCommitNotification('owner', 'repo', 'hash', 'channel')
      ).rejects.toThrowError('Missing env variables: SLACK_SIGNING_SECRET');
    });

    it('Should throw if channel is set but env.SLACK_APP_TOKEN is missing', async () => {
      process.env.SLACK_BOT_TOKEN = 'bot_token';
      process.env.SLACK_SIGNING_SECRET = 'secret';
      process.env.SLACK_APP_TOKEN = undefined;

      expect(
        sendReleaseNotification('owner', 'repo', 'hash', 'channel')
      ).rejects.toThrowError('Missing env variables: SLACK_APP_TOKEN');
    });

    it('Should throw if channel is set but multiple env vars are missing', async () => {
      process.env.SLACK_BOT_TOKEN = undefined;
      process.env.SLACK_SIGNING_SECRET = undefined;
      process.env.SLACK_APP_TOKEN = undefined;

      expect(
        sendCommitNotification('owner', 'repo', 'hash', 'channel')
      ).rejects.toThrowError(
        'Missing env variables: SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN'
      );
    });
  });

  describe('sendPullRequestSuccessNotification', () => {
    it('Should print to the console and not attempt to send a slack message if channel is not set', async () => {
      await sendPullRequestSuccessNotification({
        htmlUrl: 'url',
        title: 'title',
      });
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      expect(consoleSpy).toHaveBeenCalledWith('Slack channel not set');
      expect(consoleSpy).toHaveBeenCalledWith(
        `An automated Pull Request has been opened: <url|title>`
      );
    });

    it('Should send a slack message if channel and env are set', async () => {
      process.env.SLACK_BOT_TOKEN = 'bot_token';
      process.env.SLACK_SIGNING_SECRET = 'secret';
      process.env.SLACK_APP_TOKEN = 'app_token';
      await sendPullRequestSuccessNotification(
        {
          htmlUrl: 'url',
          title: 'title',
        },
        'channel'
      );
      expect(postMessageSpy).toHaveBeenCalledTimes(1);
      expect(postMessageSpy).toHaveBeenCalledWith({
        channel: 'channel',
        text: `An automated Pull Request has been opened: <url|title>`,
      });
    });

    it('Should throw if channel is set but env.SLACK_BOT_TOKEN is missing', async () => {
      process.env.SLACK_BOT_TOKEN = undefined;
      process.env.SLACK_SIGNING_SECRET = 'secret';
      process.env.SLACK_APP_TOKEN = 'app_token';

      expect(
        sendPullRequestSuccessNotification(
          {
            htmlUrl: 'url',
            title: 'title',
          },
          'channel'
        )
      ).rejects.toThrowError('Missing env variables: SLACK_BOT_TOKEN');
    });

    it('Should throw if channel is set but env.SLACK_SIGNING_SECRET is missing', async () => {
      process.env.SLACK_BOT_TOKEN = 'bot_token';
      process.env.SLACK_SIGNING_SECRET = undefined;
      process.env.SLACK_APP_TOKEN = 'app_token';

      expect(
        sendPullRequestSuccessNotification(
          {
            htmlUrl: 'url',
            title: 'title',
          },
          'channel'
        )
      ).rejects.toThrowError('Missing env variables: SLACK_SIGNING_SECRET');
    });

    it('Should throw if channel is set but env.SLACK_APP_TOKEN is missing', async () => {
      process.env.SLACK_BOT_TOKEN = 'bot_token';
      process.env.SLACK_SIGNING_SECRET = 'secret';
      process.env.SLACK_APP_TOKEN = undefined;

      expect(
        sendPullRequestSuccessNotification(
          {
            htmlUrl: 'url',
            title: 'title',
          },
          'channel'
        )
      ).rejects.toThrowError('Missing env variables: SLACK_APP_TOKEN');
    });

    it('Should throw if channel is set but multiple env vars are missing', async () => {
      process.env.SLACK_BOT_TOKEN = undefined;
      process.env.SLACK_SIGNING_SECRET = undefined;
      process.env.SLACK_APP_TOKEN = undefined;

      expect(
        sendPullRequestSuccessNotification(
          {
            htmlUrl: 'url',
            title: 'title',
          },
          'channel'
        )
      ).rejects.toThrowError(
        'Missing env variables: SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN'
      );
    });
  });

  describe('sendPullRequestFailureNotification', () => {
    it('Should print to the console and not attempt to send a slack message if channel is not set', async () => {
      await sendPullRequestFailureNotification('owner', 'repo');
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      expect(consoleSpy).toHaveBeenCalledWith('Slack channel not set');
      expect(consoleSpy).toHaveBeenCalledWith(
        `Failed to create automated PR for https://github.com/owner/repo`
      );
    });

    it('Should send a slack message if channel and env are set', async () => {
      process.env.SLACK_BOT_TOKEN = 'bot_token';
      process.env.SLACK_SIGNING_SECRET = 'secret';
      process.env.SLACK_APP_TOKEN = 'app_token';
      await sendPullRequestFailureNotification('owner', 'repo', 'channel');
      expect(postMessageSpy).toHaveBeenCalledTimes(1);
      expect(postMessageSpy).toHaveBeenCalledWith({
        channel: 'channel',
        text: `Failed to create automated PR for https://github.com/owner/repo`,
      });
    });

    it('Should throw if channel is set but env.SLACK_BOT_TOKEN is missing', async () => {
      process.env.SLACK_BOT_TOKEN = undefined;
      process.env.SLACK_SIGNING_SECRET = 'secret';
      process.env.SLACK_APP_TOKEN = 'app_token';

      expect(
        sendPullRequestFailureNotification('owner', 'repo', 'channel')
      ).rejects.toThrowError('Missing env variables: SLACK_BOT_TOKEN');
    });

    it('Should throw if channel is set but env.SLACK_SIGNING_SECRET is missing', async () => {
      process.env.SLACK_BOT_TOKEN = 'bot_token';
      process.env.SLACK_SIGNING_SECRET = undefined;
      process.env.SLACK_APP_TOKEN = 'app_token';

      expect(
        sendPullRequestFailureNotification('owner', 'repo', 'channel')
      ).rejects.toThrowError('Missing env variables: SLACK_SIGNING_SECRET');
    });

    it('Should throw if channel is set but env.SLACK_APP_TOKEN is missing', async () => {
      process.env.SLACK_BOT_TOKEN = 'bot_token';
      process.env.SLACK_SIGNING_SECRET = 'secret';
      process.env.SLACK_APP_TOKEN = undefined;

      expect(
        sendPullRequestFailureNotification('owner', 'repo', 'channel')
      ).rejects.toThrowError('Missing env variables: SLACK_APP_TOKEN');
    });

    it('Should throw if channel is set but multiple env vars are missing', async () => {
      process.env.SLACK_BOT_TOKEN = undefined;
      process.env.SLACK_SIGNING_SECRET = undefined;
      process.env.SLACK_APP_TOKEN = undefined;

      expect(
        sendPullRequestFailureNotification('owner', 'repo', 'channel')
      ).rejects.toThrowError(
        'Missing env variables: SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN'
      );
    });
  });
});
