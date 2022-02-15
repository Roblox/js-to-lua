import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  callExpression,
  identifier,
  LuaExpression,
  memberExpression,
} from '@js-to-lua/lua-types';
import { AwaitExpression, Expression } from '@babel/types';

export const createAwaitExpressionHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>
) =>
  createHandler<LuaExpression, AwaitExpression>(
    'AwaitExpression',
    (source, config, node) =>
      callExpression(
        memberExpression(
          expressionHandlerFunction(source, config, node.argument),
          ':',
          identifier('expect')
        ),
        []
      )
  );
