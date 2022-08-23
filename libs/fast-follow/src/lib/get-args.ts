import * as yargs from 'yargs';
import { CompareOptions } from './commands/compare';

export function setupCommands({
  scanReleases,
  scanCommits,
  compareDownstreams,
}: {
  scanReleases: (owner: string, repo: string, channel: string) => Promise<void>;
  scanCommits: (owner: string, repo: string, channel: string) => Promise<void>;
  compareDownstreams: (options: CompareOptions) => Promise<void>;
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
          .option('outDir', {
            alias: ['out-dir', 'o'],
            type: 'string',
            describe: 'location to dump patch files',
            requiresArg: true,
          })
          .option('pullRequest', {
            alias: ['pull-request', 'p'],
            type: 'boolean',
            describe:
              'open or update a pull request in the downstream repository',
            default: false,
          }),
      async (argv) => {
        const { sourceDir, outDir, pullRequest } = argv;

        return compareDownstreams({ sourceDir, outDir, pullRequest });
      }
    )
    .command(
      'release-scan',
      'scan a repository for new releases and notify about changes made upstream.',
      (yargs) =>
        yargs
          .option('owner', {
            alias: 'o',
            type: 'string',
            describe: 'owner of the repo being scanned',
            demandOption: true,
            requiresArg: true,
          })
          .option('repo', {
            alias: 'r',
            type: 'string',
            describe: 'name of the repo being scanned',
            demandOption: true,
            requiresArg: true,
          })
          .option('channel', {
            alias: 'c',
            type: 'string',
            describe: 'id of the slack channel to post the notification to',
            demandOption: true,
            requiresArg: true,
          }),
      async (argv) => {
        const { owner, repo, channel } = argv;

        return scanReleases(owner, repo, channel);
      }
    )
    .command(
      'commit-scan',
      'scan a repository for new commits and notify about changes made upstream.',
      (yargs) =>
        yargs
          .option('owner', {
            alias: 'o',
            type: 'string',
            describe: 'owner of the repo being scanned',
            demandOption: true,
            requiresArg: true,
          })
          .option('repo', {
            alias: 'r',
            type: 'string',
            describe: 'name of the repo being scanned',
            demandOption: true,
            requiresArg: true,
          })
          .option('channel', {
            alias: 'c',
            type: 'string',
            describe: 'id of the slack channel to post the notification to',
            demandOption: true,
            requiresArg: true,
          }),
      async (argv) => {
        const { owner, repo, channel } = argv;

        return scanCommits(owner, repo, channel);
      }
    )
    .help().argv;
}
