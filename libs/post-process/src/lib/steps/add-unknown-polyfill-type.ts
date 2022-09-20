import {
  hasUnknownTypePolyfillExtra,
  prependProgram,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  typeAliasDeclaration,
  typeAny,
} from '@js-to-lua/lua-types';
import { ProcessProgramFunction } from '@js-to-lua/plugin-utils';

export const addUnknownPolyfillType: ProcessProgramFunction = (program) => {
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
};
