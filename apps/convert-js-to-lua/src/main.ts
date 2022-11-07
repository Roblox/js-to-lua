import { JsToLuaPlugin } from '@js-to-lua/plugin-utils';
// TODO: remove hard dependency when plugin is build separately
import { jestPostProcessPlugin } from '@js-to-lua/plugins/jest-globals';
import { knownImportsPlugin } from '@js-to-lua/plugins/known-imports';
import { isTruthy } from '@js-to-lua/shared-utils';
import { convertFiles } from './app/convert-files';
import { getArgs } from './app/get-args';
import { getFiles } from './app/get-files';

const {
  input,
  output,
  filemap,
  babelConfig,
  babelTransformConfig,
  rootDir,
  sha,
  remoteUrl,
  plugin: argsPlugins,
} = getArgs();

const isString = (v: unknown): v is string => typeof v === 'string';

const resolvePlugins = (
  plugins: Array<string>
): Promise<Array<JsToLuaPlugin>> =>
  Promise.all(plugins.map(resolvePlugin)).then((plugins) =>
    plugins.filter(isTruthy)
  );

const resolvePlugin = async (
  plugin: string
): Promise<JsToLuaPlugin | undefined> => {
  if (
    plugin === 'jestGlobals' ||
    plugin === '@js-to-lua/plugins/jest-globals'
  ) {
    return jestPostProcessPlugin;
  }
  if (
    plugin === 'knownImports' ||
    plugin === '@js-to-lua/plugins/known-imports'
  ) {
    return knownImportsPlugin;
  }
  if (plugin) {
    try {
      return import(/* webpackIgnore: true */ plugin);
    } catch (err) {
      console.warn(`Couldn't resolve plugin "${plugin}":\n${err}`);
    }
  }
  return undefined;
};

const convertFilesFnPromise = resolvePlugins(argsPlugins).then((plugins) =>
  convertFiles({
    rootDir,
    outputDir: output,
    fileMapPath: filemap,
    babelConfig,
    babelTransformConfig,
    sha,
    remoteUrl,
    plugins,
  })
);
const filesPromise = getFiles(input.filter(isString));

Promise.all([filesPromise, convertFilesFnPromise]).then(
  ([files, convertFilesFn]) => convertFilesFn(files)
);
