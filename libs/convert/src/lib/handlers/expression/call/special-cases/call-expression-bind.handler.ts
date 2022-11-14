import {
  createOptionalHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  callExpression,
  expressionStatement,
  functionExpression,
  identifier,
  LuaExpression,
  nodeGroup,
} from '@js-to-lua/lua-types';
import {
  CallExpression,
  Expression,
  isIdentifier,
  isMemberExpression as isBabelMemberExpression,
} from '@babel/types';
import { createCallExpressionArgumentsHandler } from '../call-expression-arguments.handler';
import { createCalleeExpressionHandlerFunction } from '../callee-expression.handler';

export const createCallExpressionBindHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) =>
  createOptionalHandlerFunction<LuaExpression, CallExpression>(
    (source, config, expression) => {
      if (
        isBabelMemberExpression(expression.callee) &&
        isIdentifier(expression.callee.property) &&
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
            expressionStatement(
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
