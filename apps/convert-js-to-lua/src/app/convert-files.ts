import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import { join, parse } from 'path';
import { format_code } from 'stylua-wasm';
import { convert } from './convert';
import { transform } from './transform';

const safeApply =
  <T>(fn: (arg: T) => T, defaultValue?: T) =>
  (arg: T) => {
    try {
      return fn(arg);
    } catch {
      console.warn('failed to format file');
      return defaultValue || arg;
    }
  };

export const convertFiles =
  (outputDir: string, babelConfig?: string, babelTransformConfig?: string) =>
  (files: string[]) => {
    const output = (filePath: string) =>
      join(outputDir, changeExtension(filePath, '.lua'));

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
      ([options, transformOptions]) =>
        Promise.all(
          files.map((file) =>
            readFile(file, { encoding: 'utf-8' })
              .then((code) =>
                transform(transformOptions, parse(file).base, code)
              )
              .then((code) =>
                convert(options)({ isInitFile: isInitFile(file) }, code)
              )
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
                console.info('output file', output(file));
                return prepareDir(output(file)).then((outputFile) =>
                  writeFile(outputFile, luaCode)
                );
              })
              .catch((err) => {
                console.warn('failed file:', file);
                console.warn('error: ', err);
              })
          )
        )
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
