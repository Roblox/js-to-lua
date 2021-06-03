import { Expression, UnaryExpression } from '@babel/types';
import {
  callExpression,
  identifier,
  LuaCallExpression,
  LuaExpression,
  LuaUnaryDeleteExpression,
  LuaUnaryExpression,
  LuaUnaryNegationExpression,
  LuaUnaryVoidExpression,
  unaryDeleteExpression,
  unaryExpression,
  unaryNegationExpression,
  unaryVoidExpression,
  UnhandledNode,
  unhandledNode,
} from '@js-to-lua/lua-types';
import { BaseNodeHandler, HandlerFunction } from '../types';

export const createUnaryExpressionHandler = (
  handleExpression: HandlerFunction<Expression, LuaExpression>
): BaseNodeHandler<
  UnaryExpression,
  | LuaUnaryExpression
  | LuaUnaryVoidExpression
  | LuaUnaryNegationExpression
  | LuaUnaryDeleteExpression
  | LuaCallExpression
  | UnhandledNode
> => ({
  type: 'UnaryExpression',
  handler: (node: UnaryExpression) => {
    switch (node.operator) {
      case 'typeof':
        return callExpression(identifier('typeof'), [
          handleExpression(node.argument),
        ]);
      case '+':
        return callExpression(identifier('tonumber'), [
          handleExpression(node.argument),
        ]);
      case '-':
        return unaryExpression(node.operator, handleExpression(node.argument));
      case 'void':
        return unaryVoidExpression(handleExpression(node.argument));
      case '!':
        return unaryNegationExpression(
          handleExpression(node.argument),
          { argumentStart: node.argument.start, argumentEnd: node.argument.end }
        );
      case 'delete':
        return unaryDeleteExpression(handleExpression(node.argument));
      default:
        return unhandledNode(node.start, node.end);
    }
  },
});
