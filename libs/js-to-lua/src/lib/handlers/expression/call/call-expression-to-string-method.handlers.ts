import { createOptionalHandlerFunction, HandlerFunction } from '../../../types';
import {
  callExpression,
  identifier,
  LuaCallExpression,
  LuaExpression,
} from '@js-to-lua/lua-types';
import {
  CallExpression,
  Expression,
  isMemberExpression as isBabelMemberExpression,
} from '@babel/types';
import { matchesBabelMemberExpressionProperty } from './utils';
import { createCalleeExpressionHandlerFunction } from './callee-expression.handler';

export const createCallExpressionToStringMethodHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) =>
  createOptionalHandlerFunction<LuaCallExpression, CallExpression>(
    (source, config, expression) => {
      if (
        isBabelMemberExpression(expression.callee) &&
        matchesBabelMemberExpressionProperty('toString', expression.callee) &&
        !expression.arguments.length
      ) {
        const handleCalleeExpression =
          createCalleeExpressionHandlerFunction(handleExpression);
        return callExpression(identifier('tostring'), [
          handleCalleeExpression(source, config, expression.callee.object),
        ]);
      }
    }
  );
