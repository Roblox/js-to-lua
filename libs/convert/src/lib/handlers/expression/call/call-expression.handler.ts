import {
  CallExpression,
  Expression,
  isMemberExpression as isBabelMemberExpression,
  isPrivateName,
} from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { defaultExpressionHandler } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  indexExpression,
  isIdentifier,
  LuaExpression,
  memberExpression,
} from '@js-to-lua/lua-types';
import { createCallExpressionArgumentsHandler } from './call-expression-arguments.handler';
import { createCallExpressionDefaultHandler } from './call-expression-default.handler';
import { createCallExpressionSpecialCasesHandler } from './special-cases/call-expression-special-cases.handler';

export const createCallExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) =>
  createHandler<LuaExpression, CallExpression>(
    'CallExpression',
    (source, config, expression) => {
      const handled = createCallExpressionSpecialCasesHandler(handleExpression)(
        source,
        config,
        expression
      );

      if (handled) {
        return handled;
      }

      const callee = expression.callee;

      if (isBabelMemberExpression(callee)) {
        const args = createCallExpressionArgumentsHandler(handleExpression)(
          source,
          config,
          expression.arguments
        );
        const propertyExpression = isPrivateName(callee.property)
          ? defaultExpressionHandler(source, config, callee.property)
          : handleExpression(source, config, callee.property);

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

      return createCallExpressionDefaultHandler(handleExpression)(
        source,
        config,
        expression
      );
    }
  );
