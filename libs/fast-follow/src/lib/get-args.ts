import * as yargs from 'yargs';

export function setupCommands({
  scanReleases,
  scanCommits,
}: {
  scanReleases: (owner: string, repo: string, channel: string) => Promise<void>;
  scanCommits: (owner: string, repo: string, channel: string) => Promise<void>;
}) {
  return yargs
    .scriptName('fast-follow')
    .usage('$0 command [args]')
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
