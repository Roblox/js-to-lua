import { applyPatch } from './lib/commands/apply-patch';
import { compareSinceLastSync } from './lib/commands/compare';
import { scanCommits } from './lib/commands/scan-commits';
import { scanReleases } from './lib/commands/scan-releases';
import { setupCommands } from './lib/get-args';

function main() {
  setupCommands({
    scanReleases,
    scanCommits,
    compareSinceLastSync,
    applyPatch,
  });
}

main();
