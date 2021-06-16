import { rmSync } from 'fs';
import { readFile } from 'fs/promises';
import { format, join, normalize, ParsedPath } from 'path';

import {
  changeExtension,
  execAsync,
  getFiles,
  normalizeLineEndings,
  normalizedConfig,
} from './test-utils';

export enum Milestone {
  M1,
  M2,
  M3,
  M4,
  Unspecified,
}

const descriptions = {
  [Milestone.M1]: 'Milestone 1',
  [Milestone.M2]: 'Milestone 2',
  [Milestone.M3]: 'Milestone 3',
  [Milestone.M4]: 'Milestone 4',
  [Milestone.Unspecified]: 'Milestone Unspecified',
};

const predicates = {
  [Milestone.M1]: (filePath: ParsedPath) => /_m1x?$/.test(filePath.name),
  [Milestone.M2]: (filePath: ParsedPath) => /_m2x?$/.test(filePath.name),
  [Milestone.M3]: (filePath: ParsedPath) => /_m3x?$/.test(filePath.name),
  [Milestone.M4]: (filePath: ParsedPath) => /_m4x?$/.test(filePath.name),
  [Milestone.Unspecified]: (filePath: ParsedPath) =>
    !/_m\dx?$/.test(filePath.name),
};

export const conformanceTests = (
  milestone: Milestone,
  { describe, it, xit, expect }
) =>
  describe(`conformance tests - ${descriptions[milestone]}`, () => {
    rmSync(normalizedConfig.outputPath, { recursive: true, force: true });
    const files = getFiles(normalizedConfig.inputPath);
    const translateFiles = files.filter((filePath) => {
      return (
        (filePath.ext === '.js' || filePath.ext === '.ts') &&
        predicates[milestone](filePath)
      );
    });

    translateFiles.forEach((givenFile) => {
      const filePath = format(givenFile);
      const testCase = normalizedConfig.excludeFiles.includes(
        normalize(filePath)
      )
        ? xit
        : it;

      testCase(`should convert: ${filePath}`, async () => {
        const expectedFile = changeExtension(filePath, '.lua');
        const resultFile = join(normalizedConfig.outputPath, expectedFile);

        const command = `node dist/apps/convert-js-to-lua/main.js --i ${filePath} -o ${normalizedConfig.outputPath}`;
        await execAsync(command);
        return Promise.all([
          readFile(expectedFile, { encoding: 'utf-8' }).then(
            normalizeLineEndings
          ),
          readFile(resultFile, { encoding: 'utf-8' }).then(
            normalizeLineEndings
          ),
        ]).then(([expectedContent, resultContent]) => {
          expect(resultContent).toEqual(expectedContent);
        });
      });
    });
  });
