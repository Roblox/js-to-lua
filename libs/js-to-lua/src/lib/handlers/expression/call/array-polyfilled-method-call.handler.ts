import { createOptionalHandlerFunction, HandlerFunction } from '../../../types';
import {
  arrayMethod,
  callExpression,
  LuaCallExpression,
  LuaExpression,
} from '@js-to-lua/lua-types';
import { CallExpression, Expression, MemberExpression } from '@babel/types';
import { applyTo } from 'ramda';
import { isAnyPolyfilledArrayMethod } from './is-array-method';

export const createArrayPolyfilledMethodCallHandler = (
  handleExpressionFunction: HandlerFunction<LuaExpression, Expression>
) =>
  createOptionalHandlerFunction<
    LuaCallExpression,
    Omit<CallExpression, 'callee'> & { callee: MemberExpression }
  >((source, config, expression) => {
    if (isAnyPolyfilledArrayMethod(expression)) {
      const handleExpression = handleExpressionFunction(source, config);
      return applyTo(
        {
          calleeObject: handleExpression(expression.callee.object),
          args: expression.arguments.map(handleExpression),
        },
        ({ calleeObject, args }) =>
          callExpression(arrayMethod(expression.callee.property.name), [
            calleeObject,
            ...args,
          ])
      );
    }
    return undefined;
  });
