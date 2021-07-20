import { createHandler, HandlerFunction } from '../../types';
import {
  callExpression,
  identifier,
  LuaExpression,
  memberExpression,
} from '@js-to-lua/lua-types';
import { Expression, NewExpression } from '@babel/types';
import { createCalleeExpressionHandlerFunction } from './callee-expression.handler';

export const createNewExpressionHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>
) =>
  createHandler<LuaExpression, NewExpression>(
    'NewExpression',
    (source, config, node) => {
      const handleCalleeExpression = createCalleeExpressionHandlerFunction(
        expressionHandlerFunction
      )(source, config);
      const handleExpression = expressionHandlerFunction(source, config);
      return callExpression(
        memberExpression(
          handleCalleeExpression(node.callee),
          '.',
          identifier('new')
        ),
        node.arguments.map(handleExpression)
      );
    }
  );
