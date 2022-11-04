const { execSync } = require('child_process');
const yargs = require('yargs');
const DEFAULT_BRANCH = 'main';

async function verifyInitialConditions(git) {
  const initialStatus = await git.status();

  if (!initialStatus.isClean()) {
    throw new Error('Repository must be clean before running this command');
  }

  if (initialStatus.current !== DEFAULT_BRANCH) {
    throw new Error(
      `Creating releases is only allowed from "${DEFAULT_BRANCH}"`
    );
  }

  if (initialStatus.behind !== 0 || initialStatus.ahead !== 0) {
    const commitsDiff = initialStatus.behind || initialStatus.ahead;
    const aheadOrBehind = initialStatus.behind ? 'behind' : 'ahead';
    throw new Error(
      `Your branch "${initialStatus.current}" must be up to date with "${initialStatus.tracking} but it is ${commitsDiff} commits ${aheadOrBehind}"`
    );
  }
}

async function getNewVersionInfo() {
  const releaseAs = await releaseAsParam();
  const newVersion = execSync(
    `npx nx run workspace:version --releaseAs=${releaseAs} --dryRun | grep "Calculated new version" | awk -F \\" \'{print $2}\'`,
    {
      encoding: 'utf-8',
    }
  ).trim();
  const tagName = `v${newVersion}`;

  return {
    newVersion,
    tagName,
  };
}

function deleteTag(git, tagName) {
  return git.tag(['-d', tagName]);
}

async function releaseAsParam() {
  const args = await yargs.option('releaseAs', {
    type: 'string',
    description: 'Specify the level of change',
    default: 'patch',
  }).argv;
  return args.releaseAs;
}

module.exports = {
  verifyInitialConditions,
  getNewVersionInfo,
  deleteTag,
  releaseAsParam,
  DEFAULT_BRANCH,
};
