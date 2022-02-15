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
import { tableUnpackCall } from './know-array-methods/utils';

export const createCallExpressionApplyMethodHandlerFunction = (
  handleExpressionFunction: HandlerFunction<LuaExpression, Expression>
) =>
  createOptionalHandlerFunction<LuaCallExpression, CallExpression>(
    (source, config, expression) => {
      if (
        isBabelMemberExpression(expression.callee) &&
        matchesBabelMemberExpressionProperty('apply', expression.callee)
      ) {
        const handleExpression = handleExpressionFunction(source, config);
        const [thisArg, ...restArgs] =
          expression.arguments.map(handleExpression);
        const callee = handleExpression(expression.callee.object);
        return restArgs.length > 1
          ? undefined
          : restArgs.length === 1
          ? callExpression(callee, [thisArg, tableUnpackCall(restArgs[0])])
          : callExpression(callee, [thisArg]);
      }
    }
  );
