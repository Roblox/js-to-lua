import { combineHandlers } from '../../utils/combine-handlers';
import { LuaExpression } from '@js-to-lua/lua-types';
import { Expression, V8IntrinsicIdentifier } from '@babel/types';
import { HandlerFunction } from '../../types';

export const createCalleeExpressionHandlerFunction = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>
) =>
  combineHandlers<LuaExpression, Expression | V8IntrinsicIdentifier>(
    [],
    expressionHandlerFunction
  ).handler;
