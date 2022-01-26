import { CallExpression, Expression, MemberExpression } from '@babel/types';
import {
  LuaCallExpression,
  LuaExpression,
  WithExtras,
  withExtras,
} from '@js-to-lua/lua-types';
import {
  createOptionalHandlerFunction,
  HandlerFunction,
} from '../../../../types';
import { applyTo } from 'ramda';
import { isArrayMethod, isArrayMethodCall } from '../is-array-method';
import { matchesBabelMemberExpressionProperty } from '../utils';
import {
  tableUnpackCall,
  unshiftMultipleElements,
  unshiftSingleElement,
} from './utils';

export const createArrayUnshiftMethodCallHandler = (
  handleExpressionFunction: HandlerFunction<LuaExpression, Expression>
) =>
  createOptionalHandlerFunction<
    WithExtras<LuaCallExpression, { target: Expression }>,
    Omit<CallExpression, 'callee'> & { callee: MemberExpression }
  >((source, config, expression) => {
    const handleExpression = handleExpressionFunction(source, config);
    if (isArrayMethodCall('unshift', expression)) {
      return withExtras(
        { target: expression.callee.object },
        applyTo(
          {
            calleeObject: handleExpression(expression.callee.object),
            args: expression.arguments.map(handleExpression),
          },
          ({ calleeObject, args }) =>
            args.length === 1
              ? unshiftSingleElement(calleeObject, args[0])
              : unshiftMultipleElements(calleeObject, args)
        )
      );
    }

    if (isArrayMethod('unshift', expression.callee.object)) {
      if (matchesBabelMemberExpressionProperty('apply', expression.callee)) {
        const [thisArg, ...restArgs] =
          expression.arguments.map(handleExpression);
        return restArgs.length !== 1
          ? undefined
          : withExtras(
              { target: expression.callee.object.object },
              unshiftMultipleElements(thisArg, [tableUnpackCall(restArgs[0])])
            );
      }
      if (matchesBabelMemberExpressionProperty('call', expression.callee)) {
        const [thisArg, ...restArgs] =
          expression.arguments.map(handleExpression);
        return withExtras(
          { target: expression.callee.object.object },
          restArgs.length === 1
            ? unshiftSingleElement(thisArg, restArgs[0])
            : unshiftMultipleElements(thisArg, restArgs)
        );
      }
    }
    return undefined;
  });
