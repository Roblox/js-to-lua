import {
  ApplyPatchOptions,
  CompareOptions,
  getConfig,
  ScanCommitsOptions,
  ScanReleasesOptions,
  UpgradeOptions,
} from '@js-to-lua/fast-follow-commands';
import { ComparisonResponse, JsToLuaOptions } from '@roblox/diff-tool';
import * as yargs from 'yargs';

function extractCommaSeparatedValues(value: Array<string>): Array<string> {
  return value.map((v) => v.split(',')).flat();
}

function arrayToStringArray(value: Array<string | number>): Array<string> {
  return value.map(String);
}

const allowPublicActionsArgOptions = {
  alias: 'y',
  description:
    'Whether public actions like creating a PR or posting to Slack is allowed',
  type: 'boolean',
  default: process.env.CI === 'true',
} as const;
const allowPublicActionsArg = [
  'allowPublicActions',
  allowPublicActionsArgOptions,
] as const;
const babelConfigArgOptions = {
  description: 'Babel config file to be used by js-to-lua conversion tool',
  type: 'string',
  requiresArg: true,
} as const;
const babelConfigArg = ['babelConfig', babelConfigArgOptions] as const;
const babelConfigTransformArgOptions = {
  description:
    'Babel transform config file to be used by js-to-lua conversion tool',
  type: 'string',
  requiresArg: true,
} as const;
const babelConfigTransformArg = [
  'babelTransformConfig',
  babelConfigTransformArgOptions,
] as const;
const channelArgOptions = {
  alias: 'c',
  type: 'string',
  describe: 'id of the slack channel to post the notification to',
  requiresArg: true,
} as const;
const channelArg = ['channel', channelArgOptions] as const;
const logArgOptions = {
  alias: ['l'],
  type: 'boolean',
  describe: 'output log files with output if specified',
  default: false,
} as const;
const logArg = ['log', logArgOptions] as const;
const outputDirArgOptions = {
  alias: ['out-dir', 'o'],
  type: 'string',
  describe: 'location to dump patch files',
  requiresArg: true,
} as const;
const outputDirArg = ['outDir', outputDirArgOptions] as const;
const pluginArgOptions = {
  description:
    'Post processing plugins to be used by js-to-lua conversion tool',
  type: 'array',
  requiresArg: true,
} as const;
const pluginArg = ['plugin', pluginArgOptions] as const;
const revisionArgOptions = {
  alias: ['r'],
  type: 'string',
  describe: 'target revision upstream to sync to',
  requiresArg: true,
} as const;
const revisionArg = ['revision', revisionArgOptions] as const;
const requiredRevisionArg = [
  'revision',
  { ...revisionArgOptions, demandOption: true } as const,
] as const;
const sourceDirArgOptions = {
  alias: ['source-dir', 's'],
  type: 'string',
  describe: 'location of the source code to work with',
  demandOption: true,
} as const;
const sourceDirArg = ['sourceDir', sourceDirArgOptions] as const;

export function setupCommands({
  scanReleases,
  scanCommits,
  compareSinceLastSync,
  applyPatch,
  upgrade,
}: {
  scanReleases: (options: ScanReleasesOptions) => Promise<string | void>;
  scanCommits: (options: ScanCommitsOptions) => Promise<void>;
  compareSinceLastSync: (
    options: CompareOptions,
    jsToLuaOptions: JsToLuaOptions
  ) => Promise<ComparisonResponse>;
  applyPatch: (options: ApplyPatchOptions) => Promise<void>;
  upgrade: (
    options: UpgradeOptions,
    jsToLuaOptions: JsToLuaOptions
  ) => Promise<string | void>;
}) {
  return yargs
    .scriptName('fast-follow')
    .usage('$0 command [args]')
    .showHelpOnFail(false)
    .command(
      'compare <sourceDir>',
      'compare changes in upstream between js-to-lua versions',
      (yargs) =>
        yargs
          .positional(...sourceDirArg)
          .option(...revisionArg)
          .option(...outputDirArg)
          .option(...logArg)
          .option(...babelConfigArg)
          .option(...babelConfigTransformArg)
          .option(...pluginArg)
          .coerce({ plugin: arrayToStringArray }),
      async (argv) => {
        const {
          sourceDir,
          outDir,
          revision,
          log,
          babelConfig,
          babelTransformConfig,
          plugin: plugins,
        } = argv;
        const config = await getConfig(sourceDir);
        const jsToLuaOptions: JsToLuaOptions = {
          babelConfig,
          babelTransformConfig,
          plugins,
          remoteUrl: `https://github.com/${config.upstream.owner}/${config.upstream.repo}`,
        };

        await compareSinceLastSync(
          {
            sourceDir,
            outDir,
            revision,
            log,
          },
          jsToLuaOptions
        );
      }
    )
    .command(
      'release-scan <sourceDir>',
      'scan a repository for new releases and notify about changes made upstream.',
      (yargs) => yargs.positional(...sourceDirArg).option(...channelArg),
      async (argv) => {
        const { sourceDir, channel } = argv;
        await scanReleases({ sourceDir, channel });
      }
    )
    .command(
      'commit-scan <sourceDir>',
      'scan a repository for new commits and notify about changes made upstream.',
      (yargs) => yargs.option(...channelArg),
      (argv) => {
        const { sourceDir, channel } = argv;
        return scanCommits({ sourceDir, channel });
      }
    )
    .command(
      'apply-patch <sourceDir> <patchPath>',
      'apply patch file in downstream repo',
      (yargs) =>
        yargs
          .positional(...sourceDirArg)
          .positional('patchPath', {
            alias: ['patch'],
            type: 'string',
            describe: 'location of the patch file to apply',
            demandOption: true,
          })
          .option(...requiredRevisionArg)
          .option(...logArg)
          .option(...channelArg)
          .option(...allowPublicActionsArg),
      (argv) => {
        const {
          sourceDir,
          patchPath,
          revision,
          log,
          channel,
          allowPublicActions,
        } = argv;

        return applyPatch({
          sourceDir,
          patchPath,
          revision,
          log,
          channel,
          allowPublicActions,
        });
      }
    )
    .command(
      'upgrade <sourceDir>',
      'track releases and opens pr if possible',
      (yargs) =>
        yargs
          .positional(...sourceDirArg)
          .option(...outputDirArg)
          .option(...channelArg)
          .option(...logArg)
          .option(...revisionArg)
          .option(...babelConfigArg)
          .option(...babelConfigTransformArg)
          .option(...pluginArg)
          .option('pullRequestCC', {
            alias: ['prCC'],
            type: 'array',
            describe:
              'GitHub user names which start with @ (e.g. "@foo"). They will be mentioned in created PR description.',
            requiresArg: true,
          })
          .option(...allowPublicActionsArg)
          .coerce({
            plugin: arrayToStringArray,
            pullRequestCC: (value: Array<string | number>) =>
              extractCommaSeparatedValues(arrayToStringArray(value)),
          }),
      async (argv) => {
        const {
          channel,
          sourceDir,
          outDir,
          log,
          revision,
          babelConfig,
          babelTransformConfig,
          plugin: plugins,
          pullRequestCC = [],
          allowPublicActions,
        } = argv;

        const config = await getConfig(sourceDir);
        const jsToLuaOptions = {
          babelConfig,
          babelTransformConfig,
          plugins,
          remoteUrl: `https://github.com/${config.upstream.owner}/${config.upstream.repo}`,
        };

        await upgrade(
          {
            channel,
            sourceDir,
            outDir,
            log,
            revision,
            pullRequestCC,
            allowPublicActions,
          },
          jsToLuaOptions
        );
      }
    )
    .help().argv;
}
