import {
  hasUnknownTypePolyfillExtra,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaProgram,
  typeAliasDeclaration,
  typeAny,
} from '@js-to-lua/lua-types';
import { prependProgram } from './prepend-program';

export function addUnknownPolyfillType(program: LuaProgram) {
  return hasUnknownTypePolyfillExtra(program)
    ? prependProgram(
        [
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('unknown'), typeAny()),
            'ROBLOX FIXME: adding `unknown` type alias to make it easier to use Luau unknown equivalent when supported'
          ),
        ],
        program
      )
    : program;
}
