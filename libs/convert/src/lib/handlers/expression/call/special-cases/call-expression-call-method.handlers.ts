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
import { matchesBabelMemberExpressionProperty } from './utils';

export const createCallExpressionCallMethodHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) =>
  createOptionalHandlerFunction<LuaCallExpression, CallExpression>(
    (source, config, expression) => {
      if (
        isBabelMemberExpression(expression.callee) &&
        matchesBabelMemberExpressionProperty('call', expression.callee)
      ) {
        const toExpression = handleExpression(source, config);
        return callExpression(
          handleExpression(source, config, expression.callee.object),
          expression.arguments.map(toExpression)
        );
      }
    }
  );
