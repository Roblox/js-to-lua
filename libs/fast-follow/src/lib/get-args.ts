import { ComparisonResponse } from '@roblox/diff-tool';
import * as yargs from 'yargs';
import { ApplyPatchOptions } from './commands/apply-patch';
import { CompareOptions } from './commands/compare';
import { ScanCommitsOptions } from './commands/scan-commits';
import { ScanReleasesOptions } from './commands/scan-releases';
import { UpgradeOptions } from './commands/upgrade';

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
    options: CompareOptions
  ) => Promise<ComparisonResponse>;
  applyPatch: (options: ApplyPatchOptions) => Promise<void>;
  upgrade: (options: UpgradeOptions) => Promise<string | void>;
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
          .option('babelConfig', {
            description: 'Babel config file',
            type: 'string',
            requiresArg: true,
          })
          .option('babelTransformConfig', {
            description: 'Babel transform config file',
            type: 'string',
            requiresArg: true,
          })
          .option('log', {
            alias: ['l'],
            type: 'boolean',
            describe: 'output log files with output if specified',
            default: false,
          }),
      (argv) => {
        const {
          sourceDir,
          outDir,
          revision,
          log,
          babelConfig,
          babelTransformConfig,
        } = argv;
        return compareSinceLastSync({
          sourceDir,
          outDir,
          revision,
          log,
          babelConfig,
          babelTransformConfig,
        });
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
      (argv) => {
        const { sourceDir, channel } = argv;
        return scanReleases({ sourceDir, channel });
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
          .options('revision', {
            alias: ['r'],
            type: 'string',
            describe:
              'target revision to upgrade to. If not provided latest release will be used',
          })
          .option('babelConfig', {
            description: 'Babel config file',
            type: 'string',
            requiresArg: true,
          })
          .option('babelTransformConfig', {
            description: 'Babel transform config file',
            type: 'string',
            requiresArg: true,
          }),
      (argv) => {
        const {
          channel,
          sourceDir,
          outDir,
          log,
          revision,
          babelConfig,
          babelTransformConfig,
        } = argv;
        return upgrade({
          channel,
          sourceDir,
          outDir,
          log,
          revision,
          babelConfig,
          babelTransformConfig,
        });
      }
    )
    .help().argv;
}
