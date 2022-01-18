import { CallExpression, Expression, MemberExpression } from '@babel/types';
import {
  arrayMethod,
  callExpression,
  identifier,
  LuaCallExpression,
  LuaExpression,
  memberExpression,
  numericLiteral,
} from '@js-to-lua/lua-types';
import { createOptionalHandlerFunction, HandlerFunction } from '../../../types';
import { applyTo } from 'ramda';
import { isArrayMethod } from './is-array-method';

const unshiftSingleElement = (
  calleeObject: LuaExpression,
  args: LuaExpression[]
) =>
  callExpression(
    memberExpression(identifier('table'), '.', identifier('insert')),
    [calleeObject, numericLiteral(1), args[0]]
  );

const unshiftMultipleElements = (
  calleeObject: LuaExpression,
  args: LuaExpression[]
) => callExpression(arrayMethod('unshift'), [calleeObject, ...args]);

export const createArrayUnshiftMethodCallHandler = (
  handleExpressionFunction: HandlerFunction<LuaExpression, Expression>
) =>
  createOptionalHandlerFunction<
    LuaCallExpression,
    Omit<CallExpression, 'callee'> & { callee: MemberExpression }
  >((source, config, expression) => {
    if (isArrayMethod('unshift', expression)) {
      const handleExpression = handleExpressionFunction(source, config);
      return applyTo(
        {
          calleeObject: handleExpression(expression.callee.object),
          args: expression.arguments.map(handleExpression),
        },
        ({ calleeObject, args }) =>
          args.length === 1
            ? unshiftSingleElement(calleeObject, args)
            : unshiftMultipleElements(calleeObject, args)
      );
    }
    return undefined;
  });
