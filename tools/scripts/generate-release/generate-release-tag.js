#!/usr/bin/env node

const simpleGit = require('simple-git');
const { ResetMode } = require('simple-git');
const {
  verifyInitialConditions,
  getNewVersionInfo,
  deleteTag,
  releaseAsParam,
} = require('./generate-release-utils');
const execSync = require('child_process').execSync;

(async function (git) {
  await verifyInitialConditions(git);

  const { tagName } = await getNewVersionInfo();

  const releaseAs = await releaseAsParam();
  execSync(
    `npx nx run workspace:version --releaseAs=${releaseAs} --skipCommit`
  );

  const statusResult = await git.status();

  /**
   * This script is meant to be run after the release branch was created and merged into `main`
   * If the tree is not clean it means that the process defined in https://github.com/Roblox/js-to-lua/#release-process was not followed.
   * Please follow the instructions in https://github.com/Roblox/js-to-lua/#releasing
   */
  if (!statusResult.isClean()) {
    try {
      await git.reset(ResetMode.HARD);
      await deleteTag(git, tagName);
    } catch (err) {
      console.warn(`Could not delete a tag ${tagName}`);
    }

    throw new Error(`
      This script is meant to be executed after the release branch was created and merged into 'main'.
      After running this script the repository must not contain any changes.
      Please follow the instructions in https://github.com/Roblox/js-to-lua/#releasing
    `);
  }

  console.log(`Created a new tag: "${tagName}"`);
})(simpleGit());
