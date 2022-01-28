import { CallExpression, Expression, MemberExpression } from '@babel/types';
import { withExtras, WithExtras } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  LuaCallExpression,
  LuaExpression,
  memberExpression,
  numericLiteral,
} from '@js-to-lua/lua-types';
import {
  createOptionalHandlerFunction,
  HandlerFunction,
} from '../../../../types';
import { isArrayMethod, isArrayMethodCall } from '../is-array-method';
import { matchesBabelMemberExpressionProperty } from '../utils';

export const createArrayShiftMethodCallHandler = (
  handleExpressionFunction: HandlerFunction<LuaExpression, Expression>
) =>
  createOptionalHandlerFunction<
    WithExtras<LuaCallExpression, { target: Expression }>,
    Omit<CallExpression, 'callee'> & { callee: MemberExpression }
  >((source, config, expression) => {
    const handleExpression = handleExpressionFunction(source, config);
    if (
      isArrayMethodCall('shift', expression) &&
      expression.arguments.length === 0
    ) {
      return withExtras(
        { target: expression.callee.object },
        callExpression(
          memberExpression(identifier('table'), '.', identifier('remove')),
          [handleExpression(expression.callee.object), numericLiteral(1)]
        )
      );
    }

    if (
      isArrayMethod('shift', expression.callee.object) &&
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
            [expression.arguments.map(handleExpression)[0], numericLiteral(1)]
          )
        );
      }
    }

    return undefined;
  });
