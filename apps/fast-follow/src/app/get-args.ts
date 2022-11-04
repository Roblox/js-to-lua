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
          .positional('sourceDir', {
            alias: ['source-dir', 's'],
            type: 'string',
            describe: 'location of the source code to work with',
            demandOption: true,
          })
          .option('revision', {
            alias: ['r'],
            type: 'string',
            describe: 'target revision upstream to sync to',
            requiresArg: true,
          })
          .option('outDir', {
            alias: ['out-dir', 'o'],
            type: 'string',
            describe: 'location to dump patch files',
            requiresArg: true,
          })
          .option('log', {
            alias: ['l'],
            type: 'boolean',
            describe: 'output log files with output if specified',
            default: false,
          })
          .option('babelConfig', {
            description:
              'Babel config file to be used by js-to-lua conversion tool',
            type: 'string',
            requiresArg: true,
          })
          .option('babelTransformConfig', {
            description:
              'Babel transform config file to be used by js-to-lua conversion tool',
            type: 'string',
            requiresArg: true,
          })
          .option('plugin', {
            description:
              'Post processing plugins to be used by js-to-lua conversion tool',
            type: 'array',
            requiresArg: true,
          })
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
      'release-scan',
      'scan a repository for new releases and notify about changes made upstream.',
      (yargs) =>
        yargs
          .positional('sourceDir', {
            alias: ['source-dir', 's'],
            type: 'string',
            describe: 'location of the source code to work with',
            demandOption: true,
          })
          .option('channel', {
            alias: 'c',
            type: 'string',
            describe: 'id of the slack channel to post the notification to',
            requiresArg: true,
          }),
      async (argv) => {
        const { sourceDir, channel } = argv;
        await scanReleases({ sourceDir, channel });
      }
    )
    .command(
      'commit-scan',
      'scan a repository for new commits and notify about changes made upstream.',
      (yargs) =>
        yargs.option('channel', {
          alias: 'c',
          type: 'string',
          describe: 'id of the slack channel to post the notification to',
          requiresArg: true,
        }),
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
          .positional('sourceDir', {
            alias: ['source-dir', 's'],
            type: 'string',
            describe: 'location of the source code to work with',
            demandOption: true,
          })
          .positional('patchPath', {
            alias: ['patch'],
            type: 'string',
            describe: 'location of the patch file to apply',
            demandOption: true,
          })
          .option('revision', {
            alias: ['r'],
            type: 'string',
            describe: 'target revision upstream to sync to',
            requiresArg: true,
            demandOption: true,
          })
          .option('log', {
            alias: ['l'],
            type: 'boolean',
            describe: 'output log files with output if specified',
            default: false,
          })
          .option('channel', {
            alias: 'c',
            type: 'string',
            describe: 'id of the slack channel to post the notification to',
            requiresArg: true,
          }),
      (argv) => {
        const { sourceDir, patchPath, revision, log, channel } = argv;

        return applyPatch({
          sourceDir,
          patchPath,
          revision,
          log,
          channel,
        });
      }
    )
    .command(
      'upgrade <sourceDir>',
      'track releases and opens pr if possible',
      (yargs) =>
        yargs
          .positional('sourceDir', {
            alias: ['source-dir', 's'],
            type: 'string',
            describe: 'location of the source code to work with',
            demandOption: true,
          })
          .option('outDir', {
            alias: ['out-dir', 'o'],
            type: 'string',
            describe: 'location to dump patch files',
            requiresArg: true,
          })
          .option('channel', {
            alias: 'c',
            type: 'string',
            describe: 'id of the slack channel to post the notification to',
            requiresArg: true,
          })
          .option('log', {
            alias: ['l'],
            type: 'boolean',
            describe: 'output log files with output if specified',
            default: false,
          })
          .option('revision', {
            alias: ['r'],
            type: 'string',
            describe:
              'target revision to upgrade to. If not provided latest release will be used',
            requiresArg: true,
          })
          .option('babelConfig', {
            description:
              'Babel config file to be used by js-to-lua conversion tool',
            type: 'string',
            requiresArg: true,
          })
          .option('babelTransformConfig', {
            description:
              'Babel transform config file to be used by js-to-lua conversion tool',
            type: 'string',
            requiresArg: true,
          })
          .option('plugin', {
            description:
              'Post processing plugins to be used by js-to-lua conversion tool',
            type: 'array',
            requiresArg: true,
          })
          .option('pullRequestCC', {
            alias: ['prCC'],
            type: 'array',
            describe:
              'GitHub user names which start with @ (e.g. "@foo"). They will be mentioned in created PR description.',
            requiresArg: true,
          })
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
          },
          jsToLuaOptions
        );
      }
    )
    .help().argv;
}
