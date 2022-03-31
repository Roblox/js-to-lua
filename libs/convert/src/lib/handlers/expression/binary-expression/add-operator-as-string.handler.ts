import { BinaryExpression, Expression, PrivateName } from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  binaryExpression,
  LuaBinaryExpression,
  LuaExpression,
} from '@js-to-lua/lua-types';
import { createOperandAsStringHandlerFunction } from './operand-as-string.handler';

export const createBinaryAddOperatorAsStringHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  const handleOperandAsString =
    createOperandAsStringHandlerFunction(handleExpression);

  return createHandlerFunction<
    LuaBinaryExpression,
    BinaryExpression & { operator: '+' }
  >(
    (source: string, config, node) =>
      binaryExpression(
        // TODO: handle PrivateName
        handleOperandAsString(
          source,
          config,
          node.left as Exclude<typeof node.left, PrivateName>
        ),
        '..',
        handleOperandAsString(source, config, node.right)
      ),
    { skipComments: true }
  );
};
