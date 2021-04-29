const path = require('path');

module.exports = {
  '*.{json,md,css,scss}': (files) => {
    if (
      files.length > 0 &&
      files[0] !== '[filename]' &&
      files[0] !== '[file]'
    ) {
      const cwd = process.cwd();
      const relativePaths = files.map((f) => path.relative(cwd, f));
      /**
       * We don't need to run the linter for these files.
       */
      return [`nx format:write --files="${relativePaths.join(',')}"`];
    } else {
      return [];
    }
  },
  '*.{html,js,ts}': (files) => {
    if (
      files.length > 0 &&
      files[0] !== '[filename]' &&
      files[0] !== '[file]'
    ) {
      const cwd = process.cwd();
      const relativePaths = files.map((f) => path.relative(cwd, f));
      /**
       * This reduces the memory consumption of the script, so it won't fail on particular machines.
       */
      return [
        `nx format:write --files="${relativePaths.join(',')}"`, //
        `nx affected:lint --files="${relativePaths.join(
          ','
        )}" --fix --parallel`, //
      ];
    } else {
      return [];
    }
  },
};
