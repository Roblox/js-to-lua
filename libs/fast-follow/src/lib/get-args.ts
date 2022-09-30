import { ComparisonResponse } from '@roblox/diff-tool';
import { ConversionConfig } from '@roblox/release-tracker';
import * as yargs from 'yargs';
import { ApplyPatchOptions } from './commands/apply-patch';
import { CompareOptions } from './commands/compare';
import { getConfig } from './commands/get-config';
import { isPullRequestOpen } from './commands/pr-utils';

export function setupCommands({
  scanReleases,
  scanCommits,
  compareSinceLastSync,
  applyPatch,
}: {
  scanReleases: (options: {
    config: ConversionConfig;
    channel: string;
  }) => Promise<string | void>;
  scanCommits: (options: {
    config: ConversionConfig;
    channel: string;
  }) => Promise<void>;
  compareSinceLastSync: (
    options: CompareOptions
  ) => Promise<ComparisonResponse>;
  applyPatch: (options: ApplyPatchOptions) => Promise<void>;
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
            alias: ['rev'],
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
          }),
      async (argv) => {
        const { sourceDir, outDir, revision, log } = argv;
        const config = await getConfig(sourceDir);
        return compareSinceLastSync({
          sourceDir,
          outDir,
          revision,
          log,
          config,
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
            demandOption: true,
            requiresArg: true,
          }),
      async (argv) => {
        const { sourceDir, channel } = argv;
        const config = await getConfig(sourceDir);
        return scanReleases({ config, channel });
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
          demandOption: true,
          requiresArg: true,
        }),
      async (argv) => {
        const { sourceDir, channel } = argv;
        const config = await getConfig(sourceDir);
        return scanCommits({ config, channel });
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
            demandOption: true,
            requiresArg: true,
          }),
      async (argv) => {
        const { sourceDir, patchPath, revision, log, channel } = argv;
        const config = await getConfig(sourceDir);

        if (await isPullRequestOpen(revision, config)) {
          console.log(
            `Fast Follow PR for ${revision} already exists. Skipping next steps`
          );
          return;
        }

        return applyPatch({
          sourceDir,
          patchPath,
          revision,
          log,
          channel,
          config,
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
            demandOption: true,
            requiresArg: true,
          })
          .option('log', {
            alias: ['l'],
            type: 'boolean',
            describe: 'output log files with output if specified',
            default: false,
          }),
      async (argv) => {
        const { channel, sourceDir, outDir, log } = argv;
        const config = await getConfig(sourceDir);

        console.log('Scanning releases...');

        const revision = await scanReleases({ config, channel });

        if (!revision) {
          return console.log('Conversion up to date.');
        }

        if (await isPullRequestOpen(revision, config)) {
          console.log(
            `Fast Follow PR for ${revision} already exists. Skipping next steps`
          );
          return;
        }

        console.log('New release found. Starting conversion...');

        const { patchPath, failedFiles, conflictsSummary } =
          await compareSinceLastSync({
            sourceDir,
            outDir,
            revision,
            log,
            config,
          });

        const descriptionData = {
          failedFiles,
          conflictsSummary,
        };

        console.log('Conversion completed.');

        return applyPatch({
          sourceDir,
          patchPath,
          revision,
          log,
          channel,
          config,
          descriptionData,
        });
      }
    )
    .help().argv;
}
