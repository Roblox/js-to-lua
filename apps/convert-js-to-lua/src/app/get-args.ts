import * as yargs from 'yargs';

interface Args {
  input: Array<string | number>;
  output: string;
  babelConfig: string;
}

export const getArgs = (): Args => {
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
    .option('babelConfig', {
      description: 'Babel config file',
      type: 'string',
    })
    .help()
    .alias('help', 'h');

  const DEFAULT_ARGS: Args = {
    input: [__dirname + '/fixtures/**/*sample.ts'],
    output: __dirname + '/output',
    babelConfig: '',
  };

  return {
    ...DEFAULT_ARGS,
    ...yargsConfig.argv,
  } as Args;
};
