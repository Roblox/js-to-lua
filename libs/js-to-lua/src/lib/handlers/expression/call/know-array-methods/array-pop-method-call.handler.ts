import { CallExpression, Expression, MemberExpression } from '@babel/types';
import {
  callExpression,
  identifier,
  LuaCallExpression,
  LuaExpression,
  memberExpression,
  WithExtras,
  withExtras,
} from '@js-to-lua/lua-types';
import {
  createOptionalHandlerFunction,
  HandlerFunction,
} from '../../../../types';
import { isArrayMethod, isArrayMethodCall } from '../is-array-method';
import { matchesBabelMemberExpressionProperty } from '../utils';

export const createArrayPopMethodCallHandler = (
  handleExpressionFunction: HandlerFunction<LuaExpression, Expression>
) =>
  createOptionalHandlerFunction<
    WithExtras<LuaCallExpression, { target: Expression }>,
    Omit<CallExpression, 'callee'> & { callee: MemberExpression }
  >((source, config, expression) => {
    const handleExpression = handleExpressionFunction(source, config);
    if (
      isArrayMethodCall('pop', expression) &&
      expression.arguments.length === 0
    ) {
      return withExtras(
        { target: expression.callee.object },
        callExpression(
          memberExpression(identifier('table'), '.', identifier('remove')),
          [handleExpression(expression.callee.object)]
        )
      );
    }

    if (
      isArrayMethod('pop', expression.callee.object) &&
      expression.arguments.length === 1
    ) {
      if (
        matchesBabelMemberExpressionProperty('apply', expression.callee) ||
        matchesBabelMemberExpressionProperty('call', expression.callee)
      ) {
        return withExtras(
          { target: expression.callee.object.object },
          callExpression(
            memberExpression(identifier('table'), '.', identifier('remove')),
            expression.arguments.map(handleExpression)
          )
        );
      }
    }

    return undefined;
  });
