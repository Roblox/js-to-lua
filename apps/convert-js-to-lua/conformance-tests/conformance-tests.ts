import { execSync } from 'child_process';
import { rmSync } from 'fs';
import { readFile } from 'fs/promises';
import { format, join, normalize, ParsedPath } from 'path';

import {
  changeExtension,
  getFiles,
  normalizedConfig,
  normalizeLineEndings,
} from './test-utils';

export enum Milestone {
  M1,
  M2,
  M3,
  M4,
  M5,
  M6,
  M7,
  M8,
  Unspecified,
}

const descriptions = {
  [Milestone.M1]: 'Milestone 1',
  [Milestone.M2]: 'Milestone 2',
  [Milestone.M3]: 'Milestone 3',
  [Milestone.M4]: 'Milestone 4',
  [Milestone.M5]: 'Milestone 5',
  [Milestone.M6]: 'Milestone 6 - Flow',
  [Milestone.M7]: 'Milestone 7 - jestGlobals plugin',
  [Milestone.M8]: 'Milestone 8 - knownImports plugin',
  [Milestone.Unspecified]: 'Milestone Unspecified',
};

const predicates = {
  [Milestone.M1]: (filePath: ParsedPath) => /_m1x?$/.test(filePath.name),
  [Milestone.M2]: (filePath: ParsedPath) => /_m2x?$/.test(filePath.name),
  [Milestone.M3]: (filePath: ParsedPath) => /_m3x?$/.test(filePath.name),
  [Milestone.M4]: (filePath: ParsedPath) => /_m4x?$/.test(filePath.name),
  [Milestone.M5]: (filePath: ParsedPath) => /_m5x?$/.test(filePath.name),
  [Milestone.M6]: (filePath: ParsedPath) => /_m6x?$/.test(filePath.name),
  [Milestone.M7]: (filePath: ParsedPath) => /_m7x?$/.test(filePath.name),
  [Milestone.M8]: (filePath: ParsedPath) => /_m8x?$/.test(filePath.name),
  [Milestone.Unspecified]: (filePath: ParsedPath) =>
    !/_m\dx?$/.test(filePath.name),
};

interface Jest {
  describe: jest.Describe;
  it: jest.It;
  xit: jest.It;
  expect: jest.Expect;
}

export const conformanceTests = (
  milestone: Milestone,
  { describe, it, xit, expect }: Jest,
  config?: {
    babelConfig?: string;
    babelTransformConfig?: string;
    plugins?: Array<string>;
  }
) =>
  describe(`conformance tests - ${descriptions[milestone]}`, () => {
    const outputPath = join(normalizedConfig.outputPath, Milestone[milestone]);

    rmSync(outputPath, { recursive: true, force: true });

    const command = `node dist/apps/convert-js-to-lua/index.js -i "${
      normalizedConfig.inputPath
    }/**/*.js" -i "${normalizedConfig.inputPath}/**/*.ts" -i "${
      normalizedConfig.inputPath
    }/**/*.jsx" -i "${normalizedConfig.inputPath}/**/*.tsx" -o ${outputPath}${
      config?.babelConfig ? ` --babelConfig ${config.babelConfig}` : ''
    }${
      config?.babelTransformConfig
        ? ` --babelTransformConfig ${config.babelTransformConfig}`
        : ''
    }${
      config?.plugins?.length
        ? config.plugins.map((plugin) => ` --plugin ${plugin}`)
        : ''
    } --rootDir ./ --sha sha`;

    execSync(command, { stdio: [] });

    const files = getFiles(normalizedConfig.inputPath);
    const translateFiles = files.filter((filePath) => {
      return (
        (filePath.ext === '.js' ||
          filePath.ext === '.ts' ||
          filePath.ext === '.jsx' ||
          filePath.ext === '.tsx') &&
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
        const resultFile = join(outputPath, expectedFile);

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
