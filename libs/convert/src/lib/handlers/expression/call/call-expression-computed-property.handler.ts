import {
  createOptionalHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  callExpression,
  LuaCallExpression,
  LuaExpression,
} from '@js-to-lua/lua-types';
import {
  CallExpression,
  Expression,
  isMemberExpression as isBabelMemberExpression,
} from '@babel/types';
import { createCallExpressionArgumentsHandler } from './call-expression-arguments.handler';
import { createCalleeExpressionHandlerFunction } from './callee-expression.handler';

export const createCallExpressionComputedPropertyHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) =>
  createOptionalHandlerFunction<LuaCallExpression, CallExpression>(
    (source, config, expression) => {
      if (
        isBabelMemberExpression(expression.callee) &&
        expression.callee.computed
      ) {
        const handleCalleeExpression =
          createCalleeExpressionHandlerFunction(handleExpression);
        const args = createCallExpressionArgumentsHandler(handleExpression)(
          source,
          config,
          expression.arguments
        );
        return callExpression(
          handleCalleeExpression(source, config, expression.callee),
          [
            handleCalleeExpression(source, config, expression.callee.object),
            ...args,
          ]
        );
      }
    }
  );
