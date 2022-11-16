import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  callExpression,
  LuaCallExpression,
  LuaExpression,
} from '@js-to-lua/lua-types';
import { createCallExpressionArgumentsHandler } from './call-expression-arguments.handler';
import { createCalleeExpressionHandlerFunction } from './callee-expression.handler';

export const createCallExpressionDefaultHandler = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>
) => {
  return createHandlerFunction<LuaCallExpression, Babel.CallExpression>(
    (source, config, expression) => {
      const args = createCallExpressionArgumentsHandler(handleExpression)(
        source,
        config,
        expression.arguments
      );

      const handleCalleeExpression =
        createCalleeExpressionHandlerFunction(handleExpression);

      return callExpression(
        handleCalleeExpression(source, config, expression.callee),
        args
      );
    },
    { skipComments: true }
  );
};
