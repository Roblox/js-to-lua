import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import { convert } from './convert';
import { join, parse } from 'path';

export const convertFiles = (outputDir: string) => (files: string[]) => {
  const output = (filePath) =>
    join(outputDir, changeExtension(filePath, '.lua'));

  return Promise.all(
    files.map((file) =>
      readFile(file, { encoding: 'utf-8' })
        .then(convert)
        .then((luaCode) => {
          console.warn('output file', output(file));
          return prepareDir(output(file)).then((outputFile) =>
            writeFile(outputFile, luaCode)
          );
        })
        .catch((err) => {
          console.warn('failed file:', file);
          console.warn('error: ', err);
        })
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
