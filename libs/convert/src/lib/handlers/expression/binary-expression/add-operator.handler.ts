import {
  BinaryExpression,
  Expression,
  isStringLiteral as isBabelStringLiteral,
  isTemplateLiteral as isBabelTemplateLiteral,
  PrivateName,
} from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { isStringInferable } from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  LuaBinaryExpression,
  LuaExpression,
} from '@js-to-lua/lua-types';
import { createBinaryAddOperatorAsStringHandlerFunction } from './add-operator-as-string.handler';

export const createBinaryAddOperatorHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  const handleBinaryAddOperatorAsString =
    createBinaryAddOperatorAsStringHandlerFunction(handleExpression);

  return createHandlerFunction<
    LuaBinaryExpression,
    BinaryExpression & { operator: '+' }
  >(
    (source: string, config, node) => {
      if (
        isBabelStringLiteral(node.left) ||
        isBabelStringLiteral(node.right) ||
        isBabelTemplateLiteral(node.left) ||
        isBabelTemplateLiteral(node.right)
      ) {
        return handleBinaryAddOperatorAsString(source, config, node);
      } else {
        const left = handleExpression(
          source,
          config,
          // TODO: handle PrivateName
          node.left as Exclude<typeof node.left, PrivateName>
        );
        const right = handleExpression(source, config, node.right);

        return isStringInferable(left) || isStringInferable(right)
          ? handleBinaryAddOperatorAsString(source, config, node)
          : binaryExpression(left, node.operator, right);
      }
    },
    { skipComments: true }
  );
};
