import { Expression } from '@babel/types';
import {
  booleanLiteral,
  booleanMethod,
  callExpression,
  isAnyNodeType,
  isBooleanLiteral,
  isMultilineStringLiteral,
  isNilLiteral,
  isNumericLiteral,
  isStringLiteral,
  isUnaryNegation,
  LuaExpression,
  LuaMultilineStringLiteral,
  LuaNumericLiteral,
  LuaStringLiteral,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { EmptyConfig, HandlerFunction } from '../types';
import { getNodeSource } from '../utils/get-node-source';

export const createExpressionAsBooleanHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => (source: string, config: EmptyConfig, node: Expression) => {
  const isCoercableLiteral = isAnyNodeType<
    LuaStringLiteral | LuaNumericLiteral | LuaMultilineStringLiteral
  >([isStringLiteral, isNumericLiteral, isMultilineStringLiteral]);

  const arg = handleExpression(source, config, node);

  if (isBooleanLiteral(arg)) {
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

  if (isUnaryNegation(arg)) {
    return arg;
  }

  return callExpression(booleanMethod('toJSBoolean'), [arg]);
};
