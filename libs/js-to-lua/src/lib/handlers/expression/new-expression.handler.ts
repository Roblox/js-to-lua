import { createHandler, HandlerFunction } from '../../types';
import {
  callExpression,
  identifier,
  isIdentifier,
  isPolyfillID,
  LuaExpression,
  memberExpression,
  PolyfillID,
  withPolyfillExtra,
} from '@js-to-lua/lua-types';
import { Expression, NewExpression } from '@babel/types';
import { createCalleeExpressionHandlerFunction } from './callee-expression.handler';

const requirePolyfill = ['Error', 'Map', 'Set', 'WeakMap'] as PolyfillID[];
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
      const callee = handleCalleeExpression(node.callee);
      const returnValue = callExpression(
        memberExpression(callee, '.', identifier('new')),
        node.arguments.map(handleExpression)
      );
      if (isIdentifier(callee) && isPolyfillID(callee.name, requirePolyfill)) {
        return withPolyfillExtra(callee.name)(returnValue);
      }
      return returnValue;
    }
  );
