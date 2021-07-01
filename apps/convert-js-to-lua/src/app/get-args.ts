import * as yargs from 'yargs';

interface Args {
  input: Array<string | number>;
  output: string;
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
    .help()
    .alias('help', 'h');

  const DEFAULT_ARGS: Args = {
    input: [__dirname + '/fixtures/**/*sample.ts'],
    output: __dirname + '/output',
  };

  return {
    ...DEFAULT_ARGS,
    ...yargsConfig.argv,
  } as Args;
};
