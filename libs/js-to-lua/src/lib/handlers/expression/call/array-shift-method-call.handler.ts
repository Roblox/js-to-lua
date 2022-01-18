import { CallExpression, Expression, MemberExpression } from '@babel/types';
import {
  callExpression,
  identifier,
  LuaCallExpression,
  LuaExpression,
  memberExpression,
  numericLiteral,
} from '@js-to-lua/lua-types';
import { createOptionalHandlerFunction, HandlerFunction } from '../../../types';
import { isArrayMethod } from './is-array-method';

export const createArrayShiftMethodCallHandler = (
  handleExpressionFunction: HandlerFunction<LuaExpression, Expression>
) =>
  createOptionalHandlerFunction<
    LuaCallExpression,
    Omit<CallExpression, 'callee'> & { callee: MemberExpression }
  >((source, config, expression) => {
    if (
      isArrayMethod('shift', expression) &&
      expression.arguments.length === 0
    ) {
      const handleExpression = handleExpressionFunction(source, config);
      return callExpression(
        memberExpression(identifier('table'), '.', identifier('remove')),
        [handleExpression(expression.callee.object), numericLiteral(1)]
      );
    }
    return undefined;
  });
