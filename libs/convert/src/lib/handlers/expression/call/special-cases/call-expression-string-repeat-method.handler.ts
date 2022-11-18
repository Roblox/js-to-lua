import * as Babel from '@babel/types';
import {
  createOptionalHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  LuaCallExpression,
  LuaExpression,
  memberExpression,
} from '@js-to-lua/lua-types';
import { createCallExpressionArgumentsHandler } from '../call-expression-arguments.handler';
import { matchesBabelMemberExpressionProperty } from './utils';

export const createCallExpressionStringRepeatMethodHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>
) =>
  createOptionalHandlerFunction<LuaCallExpression, Babel.CallExpression>(
    (source, config, expression) => {
      if (
        Babel.isMemberExpression(expression.callee) &&
        matchesBabelMemberExpressionProperty('repeat', expression.callee)
      ) {
        const argumentsHandler =
          createCallExpressionArgumentsHandler(handleExpression);

        const result = callExpression(
          memberExpression(identifier('string'), '.', identifier('rep')),
          [
            handleExpression(source, config, expression.callee.object),
            argumentsHandler(source, config, expression.arguments)[0],
          ]
        );

        return Babel.isStringLiteral(expression.callee.object)
          ? result
          : withTrailingConversionComment(
              result,
              `ROBLOX CHECK: check if '${getNodeSource(
                source,
                expression.callee.object
              )}' is a string`
            );
      }
    }
  );
