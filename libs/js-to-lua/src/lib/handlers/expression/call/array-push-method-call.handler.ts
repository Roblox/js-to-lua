import { CallExpression, Expression, MemberExpression } from '@babel/types';
import {
  arrayConcat,
  callExpression,
  identifier,
  LuaCallExpression,
  LuaExpression,
  memberExpression,
  tableConstructor,
  tableNoKeyField,
} from '@js-to-lua/lua-types';
import { createOptionalHandlerFunction, HandlerFunction } from '../../../types';
import { applyTo } from 'ramda';
import { isArrayMethod } from './is-array-method';

const insertSingleElement = (
  calleeObject: LuaExpression,
  args: LuaExpression[]
) =>
  callExpression(
    memberExpression(identifier('table'), '.', identifier('insert')),
    [calleeObject, args[0]]
  );

const insertMultipleElements = (
  calleeObject: LuaExpression,
  args: LuaExpression[]
) =>
  callExpression(arrayConcat(), [
    calleeObject,
    tableConstructor(args.map((arg) => tableNoKeyField(arg))),
  ]);

export const createArrayPushMethodCallHandler = (
  handleExpressionFunction: HandlerFunction<LuaExpression, Expression>
) =>
  createOptionalHandlerFunction<
    LuaCallExpression,
    Omit<CallExpression, 'callee'> & { callee: MemberExpression }
  >((source, config, expression) => {
    if (isArrayMethod('push', expression)) {
      const handleExpression = handleExpressionFunction(source, config);
      return applyTo(
        {
          calleeObject: handleExpression(expression.callee.object),
          args: expression.arguments.map(handleExpression),
        },
        ({ calleeObject, args }) =>
          args.length === 1
            ? insertSingleElement(calleeObject, args)
            : insertMultipleElements(calleeObject, args)
      );
    }
    return undefined;
  });
