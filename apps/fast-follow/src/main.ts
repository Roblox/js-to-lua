import {
  applyPatch,
  compareSinceLastSync,
  scanCommits,
  scanReleases,
  upgrade,
} from '@js-to-lua/fast-follow-commands';
import { setupCommands } from './app/get-args';

function main() {
  setupCommands({
    scanReleases,
    scanCommits,
    compareSinceLastSync,
    applyPatch,
    upgrade,
  });
}

main();
