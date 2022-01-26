import { createOptionalHandlerFunction, HandlerFunction } from '../../../types';
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
        const toExpression = handleExpression(source, config);
        return callExpression(
          handleCalleeExpression(source, config, expression.callee),
          [
            handleCalleeExpression(source, config, expression.callee.object),
            ...expression.arguments.map(toExpression),
          ]
        );
      }
    }
  );
