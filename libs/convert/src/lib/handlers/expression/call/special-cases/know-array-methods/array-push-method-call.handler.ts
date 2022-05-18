import { CallExpression, Expression, MemberExpression } from '@babel/types';
import {
  createOptionalHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { withExtras, WithExtras } from '@js-to-lua/lua-conversion-utils';
import { LuaCallExpression, LuaExpression } from '@js-to-lua/lua-types';
import { applyTo } from 'ramda';
import { isArrayMethod, isArrayMethodCall } from './is-array-method';
import { matchesBabelMemberExpressionProperty } from '../utils';
import {
  concatArrays,
  insertMultipleElements,
  insertSingleElement,
} from './utils';

export const createArrayPushMethodCallHandler = (
  handleExpressionFunction: HandlerFunction<LuaExpression, Expression>
) =>
  createOptionalHandlerFunction<
    WithExtras<LuaCallExpression, { target: Expression }>,
    Omit<CallExpression, 'callee'> & { callee: MemberExpression }
  >((source, config, expression) => {
    const handleExpression = handleExpressionFunction(source, config);
    if (isArrayMethodCall('push', expression)) {
      return withExtras<{ target: Expression }, LuaCallExpression>({
        target: expression.callee.object,
      })(
        applyTo(
          {
            calleeObject: handleExpression(expression.callee.object),
            args: expression.arguments.map(handleExpression),
          },
          ({ calleeObject, args }) =>
            args.length === 1
              ? insertSingleElement(calleeObject, args)
              : insertMultipleElements(calleeObject, args)
        )
      );
    }

    if (isArrayMethod('push', expression.callee.object)) {
      if (matchesBabelMemberExpressionProperty('apply', expression.callee)) {
        const [thisArg, ...restArgs] =
          expression.arguments.map(handleExpression);
        return withExtras<{ target: Expression }, LuaCallExpression>({
          target: expression.callee.object.object,
        })(concatArrays(thisArg, ...restArgs));
      }
      if (matchesBabelMemberExpressionProperty('call', expression.callee)) {
        const [thisArg, ...restArgs] =
          expression.arguments.map(handleExpression);
        return withExtras<{ target: Expression }, LuaCallExpression>({
          target: expression.callee.object.object,
        })(
          restArgs.length === 1
            ? insertSingleElement(thisArg, restArgs)
            : insertMultipleElements(thisArg, restArgs)
        );
      }
    }

    return undefined;
  });
