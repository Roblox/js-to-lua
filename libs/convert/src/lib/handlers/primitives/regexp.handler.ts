import * as Babel from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import {
  escapePattern,
  regexpIdentifier,
  withNeedsRegExpExtra,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  LuaCallExpression,
  stringLiteral,
} from '@js-to-lua/lua-types';

export const createRegExpLiteralHandler = () => {
  return createHandler<LuaCallExpression, Babel.RegExpLiteral>(
    'RegExpLiteral',
    (source, config, literal) => {
      const hasGlobalFlag = literal.flags?.includes('g');

      const args = [escapePattern(literal.pattern), literal.flags]
        .filter((x) => !!x)
        .map((s) => stringLiteral(s));

      if (hasGlobalFlag) {
        return withTrailingConversionComment(
          withNeedsRegExpExtra(callExpression(regexpIdentifier, args)),
          `ROBLOX NOTE: global flag is not implemented yet`
        );
      }
      return withNeedsRegExpExtra(callExpression(regexpIdentifier, args));
    }
  );
};
