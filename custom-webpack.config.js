const { merge } = require('webpack-merge');

module.exports = (config, _context) =>
  merge(config, {
    module: {
      parser: {
        javascript: {
          commonjsMagicComments: true,
        },
      },
    },
  });
