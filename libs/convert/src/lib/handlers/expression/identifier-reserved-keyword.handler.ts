import { Identifier } from '@babel/types';
import { createOptionalHandlerFunction } from '@js-to-lua/handler-utils';
import {
  createWithAlternativeExpressionExtras,
  createWithOriginalIdentifierNameExtras,
  luaReservedKeywords,
} from '@js-to-lua/lua-conversion-utils';
import { identifier, LuaIdentifier, stringLiteral } from '@js-to-lua/lua-types';
import { pipe } from 'ramda';

export const createReservedKeywordIdentifierOptionalHandler = () => {
  return createOptionalHandlerFunction<LuaIdentifier, Identifier>(
    (source, config, node) => {
      if (luaReservedKeywords.includes(node.name)) {
        const withOriginalIdentifierNameExtras =
          createWithOriginalIdentifierNameExtras(node.name);
        const withAlternativeStringLiteral =
          createWithAlternativeExpressionExtras(stringLiteral(node.name));
        return pipe(
          withAlternativeStringLiteral,
          withOriginalIdentifierNameExtras
        )(identifier(`${node.name}_`));
      }
    }
  );
};
