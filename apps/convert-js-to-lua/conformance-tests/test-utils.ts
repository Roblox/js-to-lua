import { readdirSync, statSync } from 'fs';
import { join, normalize, parse, ParsedPath } from 'path';
import config from './conformance.config';

export const normalizedConfig = {
  ...config,
  excludeFiles: config.excludeFiles.map((filePath) => {
    return normalize(filePath);
  }),
};

export const normalizeLineEndings = (content: string) =>
  content.replace(/\r\n/g, '\n');

export function getFiles(directory: string): ParsedPath[] {
  const dirContent = readdirSync(directory);

  const allContent = dirContent.map((file) => {
    const filePath = join(directory, file);

    const fileStat = statSync(filePath);
    if (fileStat.isDirectory()) {
      return getFiles(filePath);
    } else {
      return [parse(filePath)];
    }
  });

  return allContent.flat();
}

export function changeExtension(filePath: string, extension: string): string {
  const file = parse(filePath);
  return join(file.dir, file.name + extension);
}
