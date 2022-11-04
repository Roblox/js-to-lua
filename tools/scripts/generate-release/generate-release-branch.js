#!/usr/bin/env node

const { execSync } = require('child_process');
const simpleGit = require('simple-git');
const {
  verifyInitialConditions,
  DEFAULT_BRANCH,
  getNewVersionInfo,
  deleteTag,
  releaseAsParam,
} = require('./generate-release-utils');

(async function (git) {
  await verifyInitialConditions(git);

  const { newVersion, tagName } = await getNewVersionInfo();

  const releaseBranch = `release/${tagName}`;
  await git.checkoutBranch(releaseBranch, DEFAULT_BRANCH);

  const releaseAs = await releaseAsParam();
  execSync(`npx nx run workspace:version --releaseAs=${releaseAs}`);

  await deleteTag(git, tagName);

  console.log(`
  New version will be released: "${newVersion}"
  Branch created: "${releaseBranch}"
`);
})(simpleGit());
