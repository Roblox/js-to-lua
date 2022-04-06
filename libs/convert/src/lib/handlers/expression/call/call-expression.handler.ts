import {
  CallExpression,
  Expression,
  isMemberExpression as isBabelMemberExpression,
  isPrivateName,
} from '@babel/types';
import {
  combineOptionalHandlerFunctions,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { defaultExpressionHandler } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  indexExpression,
  isIdentifier,
  LuaExpression,
  memberExpression,
} from '@js-to-lua/lua-types';
import { createCallExpressionApplyMethodHandlerFunction } from './call-expression-apply-method.handlers';
import { createCallExpressionArgumentsHandler } from './call-expression-arguments.handler';
import { createCallExpressionCallMethodHandlerFunction } from './call-expression-call-method.handlers';
import { createCallExpressionComputedPropertyHandlerFunction } from './call-expression-computed-property.handler';
import { createCallExpressionDateMethodHandler } from './call-expression-date-method.handler';
import { createCallExpressionDotNotationHandlerFunction } from './call-expression-dot-notation.handler';
import { createCallExpressionToStringMethodHandlerFunction } from './call-expression-to-string-method.handlers';
import { createCalleeExpressionHandlerFunction } from './callee-expression.handler';
import { createCallExpressionKnownArrayMethodHandlerFunction } from './know-array-methods/call-expression-known-array-method.handler';

export const createCallExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) =>
  createHandler<LuaExpression, CallExpression>(
    'CallExpression',
    (source, config, expression) => {
      const handled = combineOptionalHandlerFunctions([
        createCallExpressionDotNotationHandlerFunction(handleExpression),
        createCallExpressionKnownArrayMethodHandlerFunction(handleExpression),
        createCallExpressionToStringMethodHandlerFunction(handleExpression),
        createCallExpressionCallMethodHandlerFunction(handleExpression),
        createCallExpressionApplyMethodHandlerFunction(handleExpression),
        createCallExpressionComputedPropertyHandlerFunction(handleExpression),
        createCallExpressionDateMethodHandler(),
      ])(source, config, expression);

      if (handled) {
        return handled;
      }

      const callee = expression.callee;
      const args = createCallExpressionArgumentsHandler(handleExpression)(
        source,
        config,
        expression.arguments
      );

      if (isBabelMemberExpression(callee)) {
        const propertyExpression = isPrivateName(callee.property)
          ? defaultExpressionHandler(source, config, callee.property)
          : handleExpression(source, config, callee.property as Expression);

        const objectExpression = handleExpression(
          source,
          config,
          callee.object
        );
        return isIdentifier(propertyExpression)
          ? callExpression(
              memberExpression(objectExpression, ':', propertyExpression),
              args
            )
          : callExpression(
              indexExpression(objectExpression, propertyExpression),
              [objectExpression, ...args]
            );
      }

      const handleCalleeExpression =
        createCalleeExpressionHandlerFunction(handleExpression);

      return callExpression(
        handleCalleeExpression(source, config, expression.callee),
        args
      );
    }
  );
