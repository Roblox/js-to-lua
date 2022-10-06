import { JsToLuaPlugin } from '@js-to-lua/plugin-utils';
import { safeApply } from '@js-to-lua/shared-utils';
import { createUpstreamPath, inferRootDir } from '@js-to-lua/upstream-utils';
import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import { join, parse, relative, resolve } from 'path';
import { format_code } from 'stylua-wasm';
import throat from 'throat';
import { convert } from './convert';
import { transform } from './transform';

type ConvertFilesOptions = {
  rootDir?: string;
  outputDir: string;
  fileMapPath: string;
  babelConfig?: string;
  babelTransformConfig?: string;
  sha?: string;
  remoteUrl?: string;
  plugins?: Array<JsToLuaPlugin>;
};

export const convertFiles =
  ({
    rootDir,
    outputDir,
    fileMapPath,
    babelConfig,
    babelTransformConfig,
    sha,
    remoteUrl,
    plugins,
  }: ConvertFilesOptions) =>
  (files: string[]) => {
    const output = async (filePath: string) => {
      const rootDir_ = await (rootDir ? rootDir : inferRootDir(filePath));
      const filePathRelative = relative(rootDir_, filePath);
      return join(
        outputDir,
        changeExtension(filePathRelative, {
          'test.ts': 'spec.lua',
          'test.js': 'spec.lua',
          'test.ts.snap': 'snap.lua',
          'test.js.snap': 'snap.lua',
        })
      );
    };

    const createFileMap = async () => await Promise.all(files.map(mapFile));

    const mapFile = async (inputPath: string) => {
      const outputPath = await output(inputPath);

      return {
        input: resolve(inputPath),
        output: resolve(outputPath),
      };
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
              const upstreamPath = await createUpstreamPath(file, {
                rootDir,
                sha,
                remoteUrl,
              });
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
                .then((outputFile) =>
                  writeFile(outputFile, luaCode, { encoding: 'utf8' })
                );
            })
            .catch((err) => {
              console.warn('failed file:', file);
              console.warn('error: ', err);
            });

        return Promise.all([
          createFileMap().then((fileMap) =>
            writeFile(fileMapPath, JSON.stringify(fileMap, undefined, 2), {
              encoding: 'utf8',
            })
          ),
          ...files.map(throat(1, convertFile)),
        ]);
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

function changeExtension(
  filePath: string,
  extensions: Record<string, string>
): string {
  const file = parse(filePath);

  const [name, ...extensionParts] = file.base.split('.');
  const extension = extensionParts.join('.');
  const newExtension = extensions[extension];

  let filename;
  if (newExtension) {
    const newName = name === 'index' ? 'init' : name;
    filename = `${newName}.${newExtension}`;
  } else {
    filename = `${file.name}.lua`;
  }

  return join(file.dir, filename);
}

function isInitFile(filePath: string): boolean {
  return parse(filePath).name.startsWith('index');
}
