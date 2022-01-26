import { createHandler, HandlerFunction } from '../../../types';
import {
  CallExpression,
  Expression,
  isMemberExpression as isBabelMemberExpression,
} from '@babel/types';
import {
  callExpression,
  LuaCallExpression,
  LuaExpression,
  LuaIdentifier,
  memberExpression,
} from '@js-to-lua/lua-types';
import { createCalleeExpressionHandlerFunction } from './callee-expression.handler';
import { createCallExpressionKnownArrayMethodHandlerFunction } from './know-array-methods/call-expression-known-array-method.handler';
import { combineOptionalHandlerFunctions } from '../../../utils/combine-optional-handlers';
import { createCallExpressionCallMethodHandlerFunction } from './call-expression-call-method.handlers';
import { createCallExpressionApplyMethodHandlerFunction } from './call-expression-apply-method.handlers';
import { createCallExpressionDotNotationHandlerFunction } from './call-expression-dot-notation.handler';
import { createCallExpressionComputedPropertyHandlerFunction } from './call-expression-computed-property.handler';
import { createCallExpressionToStringMethodHandlerFunction } from './call-expression-to-string-method.handlers';

export const createCallExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  const handleCalleeExpression =
    createCalleeExpressionHandlerFunction(handleExpression);

  return createHandler(
    'CallExpression',
    (source, config, expression: CallExpression): LuaCallExpression => {
      const handled = combineOptionalHandlerFunctions([
        createCallExpressionDotNotationHandlerFunction(handleExpression),
        createCallExpressionKnownArrayMethodHandlerFunction(handleExpression),
        createCallExpressionToStringMethodHandlerFunction(handleExpression),
        createCallExpressionCallMethodHandlerFunction(handleExpression),
        createCallExpressionApplyMethodHandlerFunction(handleExpression),
        createCallExpressionComputedPropertyHandlerFunction(handleExpression),
      ])(source, config, expression);

      if (handled) {
        return handled;
      }

      const callee = expression.callee;
      const toExpression = handleExpression(source, config);
      return isBabelMemberExpression(callee)
        ? callExpression(
            memberExpression(
              handleExpression(source, config, callee.object),
              ':',
              handleExpression(
                source,
                config,
                callee.property as Expression
              ) as LuaIdentifier
            ),
            expression.arguments.map(toExpression)
          )
        : callExpression(
            handleCalleeExpression(source, config, expression.callee),
            expression.arguments.map(toExpression)
          );
    }
  );
};
