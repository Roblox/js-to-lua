import { scanCommits } from './lib/commands/scan-commits';
import { scanReleases } from './lib/commands/scan-releases';
import { compareDownstreams } from './lib/commands/compare';
import { setupCommands } from './lib/get-args';

function main() {
  setupCommands({ scanReleases, scanCommits, compareDownstreams });
}

main();
