import { Expression } from '@babel/types';
import {
  booleanMethod,
  isBooleanInferable,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  booleanLiteral,
  callExpression,
  isAnyNodeType,
  isMultilineStringLiteral,
  isNilLiteral,
  isNumericLiteral,
  isStringLiteral,
  LuaExpression,
  LuaMultilineStringLiteral,
  LuaNumericLiteral,
  LuaStringLiteral,
} from '@js-to-lua/lua-types';
import { EmptyConfig, HandlerFunction } from '../types';
import { getNodeSource } from '../utils/get-node-source';

export const createExpressionAsBooleanHandler =
  (handleExpression: HandlerFunction<LuaExpression, Expression>) =>
  (source: string, config: EmptyConfig, node: Expression) => {
    const isCoercableLiteral = isAnyNodeType<
      LuaStringLiteral | LuaNumericLiteral | LuaMultilineStringLiteral
    >([isStringLiteral, isNumericLiteral, isMultilineStringLiteral]);

    const arg = handleExpression(source, config, node);

    if (isBooleanInferable(arg)) {
      return arg;
    }

    if (isCoercableLiteral(arg)) {
      return withTrailingConversionComment(
        booleanLiteral(!!arg.value),
        `ROBLOX DEVIATION: coerced from \`${getNodeSource(
          source,
          node
        )}\` to preserve JS behavior`
      );
    }
    if (isNilLiteral(arg)) {
      return withTrailingConversionComment(
        booleanLiteral(false),
        `ROBLOX DEVIATION: coerced from \`${getNodeSource(
          source,
          node
        )}\` to preserve JS behavior`
      );
    }

    return callExpression(booleanMethod('toJSBoolean'), [arg]);
  };
