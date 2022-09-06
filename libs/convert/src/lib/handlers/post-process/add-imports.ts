import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  variableDeclaration,
  variableDeclaratorIdentifier,
} from '@js-to-lua/lua-types';
import { packagesIdentifier } from './common-identifiers';
import { prependProgram } from './prepend-program';
import { ProcessProgramFunction } from './types';

export const addImports: ProcessProgramFunction = (program) => {
  return program.extras?.needsPackages
    ? prependProgram(
        [
          withTrailingConversionComment(
            variableDeclaration(
              [variableDeclaratorIdentifier(packagesIdentifier)],
              []
            ),
            'ROBLOX comment: must define Packages module'
          ),
        ],
        program
      )
    : program;
};
