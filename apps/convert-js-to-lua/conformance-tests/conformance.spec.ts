import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { readFile } from 'fs/promises';
import { format, join, parse, ParsedPath } from 'path';
import config from './conformance.config';

function getFiles(directory): ParsedPath[] {
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

function changeExtension(filePath: string, extension: string): string {
  const file = parse(filePath);
  return join(file.dir, file.name + extension);
}

describe('conformance tests', () => {
  const files = getFiles(config.inputPath);
  const translateFiles = files.filter((filePath) => {
    return filePath.ext === '.js' || filePath.ext === '.ts';
  });

  translateFiles.forEach((givenFile) => {
    const filePath = format(givenFile);

    const testCase = config.excludeFiles.includes(filePath) ? xit : it;

    testCase(`should convert: ${filePath}`, () => {
      const expectedFile = changeExtension(filePath, '.lua');
      const resultFile = join(config.outputPath, expectedFile);

      const command = `node dist/apps/convert-js-to-lua/main.js --i ${filePath} -o ${config.outputPath}`;
      execSync(command, {
        stdio: [],
      });
      return Promise.all([
        readFile(expectedFile, { encoding: 'utf-8' }),
        readFile(resultFile, { encoding: 'utf-8' }),
      ]).then(([expectedContent, resultContent]) => {
        expect(resultContent).toEqual(expectedContent);
      });
    });
  });
});
