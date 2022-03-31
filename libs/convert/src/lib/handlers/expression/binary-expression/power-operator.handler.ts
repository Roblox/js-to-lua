import { BinaryExpression, Expression } from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  binaryExpression,
  LuaBinaryExpression,
  LuaExpression,
} from '@js-to-lua/lua-types';

export const createPowerOperatorHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  return createHandlerFunction<
    LuaBinaryExpression,
    BinaryExpression & { operator: '**' }
  >(
    (source, config, node) => {
      return binaryExpression(
        handleExpression(source, config, node.left as Expression),
        '^',
        handleExpression(source, config, node.right)
      );
    },
    { skipComments: true }
  );
};
