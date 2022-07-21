import {
  hasVoidTypePolyfillExtra,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaProgram,
  typeAliasDeclaration,
  typeNil,
} from '@js-to-lua/lua-types';
import { prependProgram } from './prepend-program';

export function addVoidPolyfillType(program: LuaProgram) {
  return hasVoidTypePolyfillExtra(program)
    ? prependProgram(
        [
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('void'), typeNil()),
            'ROBLOX FIXME: adding `void` type alias to make it easier to use Luau `void` equivalent when supported'
          ),
        ],
        program
      )
    : program;
}
