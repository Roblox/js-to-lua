import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  LuaProgram,
  variableDeclaration,
  variableDeclaratorIdentifier,
} from '@js-to-lua/lua-types';
import { packagesIdentifier } from './common-identifiers';
import { prependProgram } from './prepend-program';

export function addImports(program: LuaProgram): LuaProgram {
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
}
