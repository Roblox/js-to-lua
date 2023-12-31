import { Expression, isNullLiteral as isBabelNullLiteral } from '@babel/types';
import { EmptyConfig, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  isBooleanLiteral,
  isNilLiteral,
  LuaExpression,
  numericLiteral,
} from '@js-to-lua/lua-types';

export const createExpressionAsNumericHandler =
  (handleExpression: HandlerFunction<LuaExpression, Expression>) =>
  (source: string, config: EmptyConfig, node: Expression) => {
    const arg: LuaExpression = handleExpression(source, config, node);

    if (isBooleanLiteral(arg)) {
      return withTrailingConversionComment(
        numericLiteral(arg.value ? 1 : 0),
        `ROBLOX DEVIATION: coerced from \`${getNodeSource(
          source,
          node
        )}\` to preserve JS behavior`
      );
    }
    if (isBabelNullLiteral(node)) {
      return withTrailingConversionComment(
        numericLiteral(0),
        `ROBLOX DEVIATION: coerced from \`${getNodeSource(
          source,
          node
        )}\` to preserve JS behavior`
      );
    }
    if (isNilLiteral(arg)) {
      return withTrailingConversionComment(
        binaryExpression(numericLiteral(0), '/', numericLiteral(0)),
        `ROBLOX DEVIATION: coerced from \`${getNodeSource(
          source,
          node
        )}\` to preserve JS behavior`
      );
    }

    return arg;
  };
