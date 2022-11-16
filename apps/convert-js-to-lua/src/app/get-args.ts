import { join } from 'path/posix';
import * as yargs from 'yargs';

interface Args {
  input: Array<string | number>;
  output: string;
  filemap: string;
  rootDir?: string;
  babelConfig?: string;
  babelTransformConfig?: string;
  sha?: string;
  remoteUrl?: string;
  plugin: Array<string>;
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
    .option('filemap', {
      description: 'Path of the file map',
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
    .option('remoteUrl', {
      alias: 'remote',
      description: 'url of the upstream repo we are converting',
      type: 'string',
    })
    .option('plugin', {
      alias: 'p',
      description: 'Post processing plugins',
      type: 'array',
    })
    .check((argv) => {
      if (argv.remoteUrl && (!argv.sha || !argv.rootDir)) {
        throw new Error(
          `If 'remoteUrl' option is specified you must also specify 'sha' and 'rootDir' options`
        );
      }
      return true;
    })
    .help()
    .alias('help', 'h');

  const baseDir = process.cwd();
  const DEFAULT_ARGS: Args = {
    input: [join(baseDir, 'fixtures/**/*sample.ts')],
    output: join(baseDir, 'output'),
    filemap: join(baseDir, 'filemap.json'),
    plugin: [],
  };

  return {
    ...DEFAULT_ARGS,
    ...yargsConfig.argv,
  } as Args;
};
