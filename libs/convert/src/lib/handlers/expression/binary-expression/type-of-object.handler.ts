import { BinaryExpression, Expression } from '@babel/types';
import {
  createOptionalHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  isObjectStringLiteral,
  isTypeofExpression,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  LuaBinaryExpression,
  LuaBinaryExpressionOperator,
  LuaExpression,
  stringLiteral,
} from '@js-to-lua/lua-types';

export const createOptionalTypeOfObjectHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  return createOptionalHandlerFunction<
    LuaBinaryExpression,
    BinaryExpression & { operator: '==' | '!=' | '===' | '!==' },
    { operator: Extract<LuaBinaryExpressionOperator, '==' | '~='> }
  >((source, config, node) => {
    if (isTypeofExpression(node.left) && isObjectStringLiteral(node.right)) {
      return binaryExpression(
        handleExpression(source, config, node.left),
        config.operator,
        stringLiteral('table')
      );
    } else if (
      isTypeofExpression(node.right) &&
      isObjectStringLiteral(node.left)
    ) {
      return binaryExpression(
        stringLiteral('table'),
        config.operator,
        handleExpression(source, config, node.right)
      );
    }

    return undefined;
  });
};
