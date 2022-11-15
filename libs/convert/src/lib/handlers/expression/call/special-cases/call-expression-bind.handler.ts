import * as Babel from '@babel/types';
import {
  createOptionalHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  callExpression,
  functionExpression,
  identifier,
  LuaExpression,
  nodeGroup,
  returnStatement,
} from '@js-to-lua/lua-types';
import { createCallExpressionArgumentsHandler } from '../call-expression-arguments.handler';
import { createCalleeExpressionHandlerFunction } from '../callee-expression.handler';

export const createCallExpressionBindHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>
) =>
  createOptionalHandlerFunction<LuaExpression, Babel.CallExpression>(
    (source, config, expression) => {
      if (
        Babel.isMemberExpression(expression.callee) &&
        Babel.isIdentifier(expression.callee.property) &&
        expression.callee.property.name === 'bind'
      ) {
        const handleCalleeExpression =
          createCalleeExpressionHandlerFunction(handleExpression);

        // first argument is the callee
        const args = createCallExpressionArgumentsHandler(handleExpression)(
          source,
          config,
          [...expression.arguments]
        );

        // push spread operator as the last argument
        args.push(identifier('...'));

        // create a function that calls the original function with our arguments
        return functionExpression(
          [identifier('...')],
          nodeGroup([
            returnStatement(
              callExpression(
                handleCalleeExpression(
                  source,
                  config,
                  expression.callee.object
                ),
                args
              )
            ),
          ])
        );
      }
    }
  );
