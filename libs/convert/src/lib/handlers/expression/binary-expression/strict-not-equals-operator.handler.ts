import { BinaryExpression, Expression } from '@babel/types';
import {
  combineOptionalHandlerFunctions,
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  binaryExpression,
  LuaBinaryExpression,
  LuaExpression,
} from '@js-to-lua/lua-types';
import { createOptionalTypeOfObjectHandlerFunction } from './type-of-object.handler';

export const createStrictNotEqualsOperatorHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  return createHandlerFunction<
    LuaBinaryExpression,
    BinaryExpression & { operator: '!==' }
  >(
    (source, config, node) => {
      return (
        combineOptionalHandlerFunctions([
          createOptionalTypeOfObjectHandlerFunction(handleExpression),
        ])(source, { operator: '~=' }, node) ||
        binaryExpression(
          handleExpression(source, config, node.left as Expression),
          '~=',
          handleExpression(source, config, node.right)
        )
      );
    },
    { skipComments: true }
  );
};
