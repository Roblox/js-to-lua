import { Expression, V8IntrinsicIdentifier } from '@babel/types';
import { combineHandlers, HandlerFunction } from '@js-to-lua/handler-utils';
import { LuaExpression } from '@js-to-lua/lua-types';

export const createCalleeExpressionHandlerFunction = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>
) =>
  combineHandlers<LuaExpression, Expression | V8IntrinsicIdentifier>(
    [],
    expressionHandlerFunction
  ).handler;
