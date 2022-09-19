import * as yargs from 'yargs';

interface Args {
  input: Array<string | number>;
  output: string;
  rootDir: string;
  babelConfig: string;
  babelTransformConfig: string;
  sha: string;
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
    .option('rootDir', {
      alias: 'root',
      description: 'Root repo directory',
      type: 'string',
    })
    .option('babelConfig', {
      description: 'Babel config file',
      type: 'string',
    })
    .option('babelTransformConfig', {
      description: 'Babel transform config file',
      type: 'string',
    })
    .option('sha', {
      description: 'SHA of the upstream repo we are converting',
      type: 'string',
    })
    .help()
    .alias('help', 'h');

  const DEFAULT_ARGS: Args = {
    input: [__dirname + '/fixtures/**/*sample.ts'],
    output: __dirname + '/output',
    rootDir: '',
    babelConfig: '',
    babelTransformConfig: '',
    sha: '',
  };

  return {
    ...DEFAULT_ARGS,
    ...yargsConfig.argv,
  } as Args;
};
