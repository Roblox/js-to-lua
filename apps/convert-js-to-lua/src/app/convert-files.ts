import { JsToLuaPlugin } from '@js-to-lua/plugin-utils';
import { safeApply } from '@js-to-lua/shared-utils';
import { createUpstreamPath, inferRootDir } from '@js-to-lua/upstream-utils';
import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import { join, parse, relative } from 'path';
import { format_code } from 'stylua-wasm';
import throat from 'throat';
import { convert } from './convert';
import { transform } from './transform';

type ConvertFilesOptions = {
  rootDir: string;
  outputDir: string;
  babelConfig?: string;
  babelTransformConfig?: string;
  sha?: string;
  plugins?: Array<JsToLuaPlugin>;
};

export const convertFiles =
  ({
    rootDir,
    outputDir,
    babelConfig,
    babelTransformConfig,
    sha,
    plugins,
  }: ConvertFilesOptions) =>
  (files: string[]) => {
    const output = async (filePath: string) => {
      const rootDir_ = await (rootDir ? rootDir : inferRootDir(filePath));
      const filePathRelative = relative(rootDir_, filePath);
      return join(outputDir, changeExtension(filePathRelative, '.lua'));
    };

    const babelOptions = babelConfig
      ? readFile(babelConfig, { encoding: 'utf-8' })
          .then((fileContent) => JSON.parse(fileContent))
          .catch(() => {
            console.warn(
              'Provided babel config is invalid! Using default config'
            );
          })
      : Promise.resolve();
    const babelTransformOptions = babelTransformConfig
      ? readFile(babelTransformConfig, { encoding: 'utf-8' })
          .then((fileContent) => JSON.parse(fileContent))
          .catch(() => {
            console.warn(
              'Provided babel transform config is invalid! Using default config'
            );
          })
      : Promise.resolve();

    return Promise.all([babelOptions, babelTransformOptions]).then(
      ([options, transformOptions]) => {
        const convertFile = (file: string): Promise<void> =>
          readFile(file, { encoding: 'utf-8' })
            .then((code) => transform(transformOptions, parse(file).base, code))
            .then(async (code) => {
              const upstreamPath = await createUpstreamPath(file, rootDir, sha);
              return convert(options)(
                { isInitFile: isInitFile(file), upstreamPath, plugins },
                code
              );
            })
            .then((code) => {
              let beforeCode = code,
                afterCode = code;
              // apply StyLua code formatting (which is not stable) until the code is not changed
              do {
                beforeCode = afterCode;
                afterCode = safeApply(format_code)(beforeCode);
              } while (beforeCode !== afterCode);

              return afterCode;
            })
            .then((luaCode) => {
              return output(file)
                .then((outputFile) => {
                  console.info('output file', outputFile);
                  return outputFile;
                })
                .then(prepareDir)
                .then((outputFile) => writeFile(outputFile, luaCode));
            })
            .catch((err) => {
              console.warn('failed file:', file);
              console.warn('error: ', err);
            });

        return Promise.all(files.map(throat(1, convertFile)));
      }
    );
  };

const prepareDir = (file: string) => {
  const lastSlash = file.lastIndexOf('/');
  const dir = file.slice(0, lastSlash);
  return stat(dir)
    .catch(() => mkdir(dir, { recursive: true }))
    .then(() => file);
};

function changeExtension(filePath: string, extension: string): string {
  const file = parse(filePath);
  return join(file.dir, file.name + extension);
}

function isInitFile(filePath: string): boolean {
  return parse(filePath).name.startsWith('index');
}
