import * as Babel from '@babel/types';
import {
  createOptionalHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { reassignComments } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  LuaExpression,
} from '@js-to-lua/lua-types';
import { createCallExpressionArgumentsHandler } from '../call-expression-arguments.handler';
import { createCalleeExpressionHandlerFunction } from '../callee-expression.handler';

export const createCallExpressionParseIntHandler = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>
) => {
  const handleCalleeExpression =
    createCalleeExpressionHandlerFunction(handleExpression);
  const handleArguments =
    createCallExpressionArgumentsHandler(handleExpression);

  return createOptionalHandlerFunction<LuaExpression, Babel.CallExpression>(
    (source, config, node) => {
      if (Babel.isIdentifier(node.callee) && node.callee.name === 'parseInt') {
        const originalCallee = handleCalleeExpression(
          source,
          config,
          node.callee
        );
        const callee = reassignComments(identifier('tonumber'), originalCallee);
        const args = handleArguments(source, config, node.arguments);

        return callExpression(callee, args);
      }
    }
  );
};
