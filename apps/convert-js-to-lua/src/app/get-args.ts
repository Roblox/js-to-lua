import * as yargs from 'yargs';

export const getArgs = () => {
  const yargsConfig = yargs
    .option('input', {
      alias: 'i',
      description: 'Input file(s) patterns',
      type: 'array',
    })
    .option('output', {
      alias: 'o',
      description: 'Output directory',
      type: 'string',
    })
    .help()
    .alias('help', 'h');

  const DEFAULT_ARGS = {
    input: __dirname + '/fixtures/**/*sample.ts',
    output: __dirname + '/output',
  };

  return {
    ...DEFAULT_ARGS,
    ...yargsConfig.argv,
  };
};
