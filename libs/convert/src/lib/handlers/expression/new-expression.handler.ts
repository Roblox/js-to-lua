import { Expression, NewExpression } from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  isPolyfillID,
  PolyfillID,
  withPolyfillExtra,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  isIdentifier,
  LuaExpression,
  memberExpression,
} from '@js-to-lua/lua-types';
import { createCalleeExpressionHandlerFunction } from './call/callee-expression.handler';
import { createNewDateOptionalHandlerFunction } from './new-expression-date.handler';

const requirePolyfill = ['Error', 'Map', 'Set', 'WeakMap'] as PolyfillID[];
export const createNewExpressionHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>
) =>
  createHandler<LuaExpression, NewExpression>(
    'NewExpression',
    (source, config, node) => {
      const result = createNewDateOptionalHandlerFunction()(
        source,
        config,
        node
      );

      if (result) {
        return result;
      }

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
