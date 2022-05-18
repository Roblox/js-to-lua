import { CallExpression, Expression, MemberExpression } from '@babel/types';
import {
  createOptionalHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  arrayMethod,
  tableUnpackCall,
  withExtras,
  WithExtras,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  LuaCallExpression,
  LuaExpression,
} from '@js-to-lua/lua-types';
import { applyTo } from 'ramda';
import {
  isAnyPolyfilledArrayMethodCall,
  isAnyPolyfilledMethod,
} from './is-array-method';
import { matchesBabelMemberExpressionProperty } from '../utils';

export const createArrayPolyfilledMethodCallHandler = (
  handleExpressionFunction: HandlerFunction<LuaExpression, Expression>
) =>
  createOptionalHandlerFunction<
    WithExtras<LuaCallExpression, { target: Expression }>,
    Omit<CallExpression, 'callee'> & { callee: MemberExpression }
  >((source, config, expression) => {
    const handleExpression = handleExpressionFunction(source, config);

    if (isAnyPolyfilledArrayMethodCall(expression)) {
      return withExtras<{ target: Expression }, LuaCallExpression>({
        target: expression.callee.object,
      })(
        applyTo(
          {
            calleeObject: handleExpression(expression.callee.object),
            args: expression.arguments.map(handleExpression),
          },
          ({ calleeObject, args }) =>
            callExpression(arrayMethod(expression.callee.property.name), [
              calleeObject,
              ...args,
            ])
        )
      );
    }

    const originalCalleeObject = expression.callee.object;
    if (isAnyPolyfilledMethod(originalCalleeObject)) {
      if (matchesBabelMemberExpressionProperty('apply', expression.callee)) {
        const [thisArg, ...restArgs] =
          expression.arguments.map(handleExpression);
        return restArgs.length !== 1
          ? undefined
          : withExtras<{ target: Expression }, LuaCallExpression>({
              target: originalCalleeObject.object,
            })(
              callExpression(arrayMethod(originalCalleeObject.property.name), [
                thisArg,
                tableUnpackCall(restArgs[0]),
              ])
            );
      }

      if (matchesBabelMemberExpressionProperty('call', expression.callee)) {
        const [thisArg, ...restArgs] =
          expression.arguments.map(handleExpression);
        return withExtras<{ target: Expression }, LuaCallExpression>({
          target: originalCalleeObject.object,
        })(
          callExpression(arrayMethod(originalCalleeObject.property.name), [
            thisArg,
            ...restArgs,
          ])
        );
      }
    }

    return undefined;
  });
