# Fast follow GitHub action

A GitHub action to run fast follow tool on a given repository.

# Installation

## Js-to-lua config file

Fast follow uses a `js-to-lua.config.js` file to retrieve all the necessary information about the repository that is
targeted for the automatic upgrade. Before enabling a fast-follow workflow please create a `js-to-lua.config.js` file in the target's repository root and provide the following content:

```js
module.exports = {
  lastSync: {
    ref: '<the latest upstream sha that the repo is synchronized with>',
    conversionToolVersion:
      '<the latest js-to-lua sha or tag that the repo is converted with>',
  },
  upstream: {
    owner: '<upstream-repo-owner>',
    repo: '<upstream-repo-name>',
    primaryBranch: '<upstream-repo-primary-branch>',
  },
  downstream: {
    owner: '<downstream-repo-owner>',
    repo: '<downstream-repo-name>',
    primaryBranch: '<downstream-repo-primary-branch>',
    patterns: [
      // glob patterns for the implementation files that need to be upgraded
      'src/**/*.lua',
    ],
  },
};
```

## Repository's workflow setup

In order to run fast follow on a target repository we suggest using the following template. In a target repository
create a file `.github/workflows/fast-follow.yml` and paste the following template in:

```yaml
name: Fast-follow

on:
  workflow_dispatch:
  schedule:
    # Scheduled to run every day at 8am UTC.
    - cron: '0 8 * * *'

jobs:
  fast-follow:
    name: Runs fast-follow
    timeout-minutes: 20
    runs-on: ubuntu-latest
    steps:
      - name: Checkout js-to-lua
        uses: actions/checkout@v3
        with:
          path: js-to-lua-action
          repository: roblox/js-to-lua
          token: ${{secrets.PERSONAL_ACCESS_TOKEN}}

      - name: Checkout repository
        uses: actions/checkout@v3
        with:
          path: downstream-repository

      - name: set up github identity
        run: |
          git config --global user.name github-actions
          git config --global user.email github@users.noreply.github.com

      - name: Run fast follow
        uses: ./js-to-lua-action/.github/actions/fast-follow
        with:
          github-token: ${{secrets.PERSONAL_ACCESS_TOKEN}}
          repo-path: downstream-repository

          # The following parameters are optional. Enable them if you've followed the `Slack channel setup` instructions first
          # slack-signing-secret: ${{secrets.SLACK_SIGNING_SECRET}}
          # slack-bot-token: ${{secrets.SLACK_BOT_TOKEN}}
          # slack-app-token: ${{secrets.SLACK_APP_TOKEN}}
          # slack-channel-id: ${{secrets.SLACK_CHANNEL_ID}}

          # the following list of comma separated users/groups will be tagged in the created upgrade PR
          pr-description-cc-users: '@username1,@username2,@group1,@group2'
```

> **_NOTE:_** the above template contains the optional Slack integration related variables commented-out. If you wish to
> add Slack integration to your fast-follow workflow please follow the [Slack channel setup](#slack-channel-setup)
> instructions

## Slack channel setup

### Repository secrets setup

The fast follow tool can post update information to a Slack channel. In order to achieve this couple of repository
secrets need to be set up:

- `SLACK_CHANNEL_ID` - can be obtained by clicking the channel name or right+click view channel details
- `SLACK_SIGNING_SECRET`
- `SLACK_BOT_TOKEN`
- `SLACK_APP_TOKEN`
  - in order to get Slack's signing secret, bot token and app token a Slack app needs to be created and approved first.
    Please find the instruction below. The same app can be used for multiple repositories that need fast follow
    functionality.

### Setting up a Slack app

- Go to:https://api.slack.com/apps
- Click `Create New App`
- Choose `From an app manifest` option
- Select a `Roblox` workspace
- In the next step paste the following JSON manifest

```json
{
  "display_information": {
    "name": "Fast Follow"
  },
  "features": {
    "bot_user": {
      "display_name": "Fast Follow",
      "always_online": false
    }
  },
  "oauth_config": {
    "scopes": {
      "bot": ["chat:write", "commands"]
    }
  },
  "settings": {
    "org_deploy_enabled": false,
    "socket_mode_enabled": false,
    "token_rotation_enabled": false
  }
}
```

- Review and confirm the selected options in the summary view
- Click `Create`

- After creating an app you can copy the **signing secret** from the basic information page that is shown automatically.
- <u>Put the signing secret in the repository's `SLACK_SIGNING_SECRET` secret</u>
- You need to generate the **App token** in the section below. Choose the following scopes:
  - connections:write
  - authorizations:read
- <u>Put the App token in the repository's `SLACK_APP_TOKEN` secret</u>
- Click on `Install into workspace` button and allow app into Roblox workspace
- Go to `OAuth & Permissions` tab
- You can copy the **bot user token** from that section
- <u>Put the Bot user token in the repository's `SLACK_BOT_TOKEN` secret</u>
- After app is installed in the workspace it needs to be added to the Slack channel e.g. `#thisdot-roblox` via:
- `+` button in the message bar
- `Add apps to this channel`
- Select the `Fast Follow` app
