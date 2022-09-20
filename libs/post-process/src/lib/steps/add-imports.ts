import {
  hasNeedsPackagesExtra,
  packagesIdentifier,
  prependProgram,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  variableDeclaration,
  variableDeclaratorIdentifier,
} from '@js-to-lua/lua-types';
import { ProcessProgramFunction } from '@js-to-lua/plugin-utils';

export const addImports: ProcessProgramFunction = (program) => {
  return hasNeedsPackagesExtra(program)
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
