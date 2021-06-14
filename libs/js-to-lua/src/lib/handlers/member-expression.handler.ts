import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../types';
import { Expression, MemberExpression, PrivateName } from '@babel/types';
import {
  callExpression,
  identifier,
  indexExpression,
  LuaExpression,
  LuaIdentifier,
  LuaIndexExpression,
  LuaMemberExpression,
  LuaNumericLiteral,
  LuaStringLiteral,
  memberExpression,
  UnhandledNode,
} from '@js-to-lua/lua-types';
import { handleIdentifier } from './expression-statement.handler';
import { handleNumericLiteral } from './primitives/numeric.handler';
import { handleStringLiteral } from './primitives/string.handler';
import { handleBooleanLiteral } from './primitives/boolean.handler';
import { createBinaryExpressionHandler } from './binary-expression.handler';
import { defaultHandler } from '../utils/default.handler';

export const createMemberExpressionHandler = (
  handleExpression: HandlerFunction<Expression, LuaExpression>
): BaseNodeHandler<
  MemberExpression,
  LuaIndexExpression | LuaMemberExpression
> => {
  const handleBinaryExpression = createBinaryExpressionHandler(
    handleExpression
  );
  const handleIndex = createHandlerFunction(
    (
      source,
      node: Expression | PrivateName
    ): LuaStringLiteral | LuaNumericLiteral | LuaExpression | UnhandledNode => {
      switch (node.type) {
        case 'NumericLiteral':
          return handleNumericLiteral.handler(source, {
            ...node,
            value: node.value + 1,
          });
        case 'StringLiteral':
          return handleStringLiteral.handler(source, node);
        case 'BooleanLiteral':
          return callExpression(identifier('tostring'), [
            handleBooleanLiteral.handler(source, node),
          ]);
        case 'Identifier':
          return callExpression(identifier('tostring'), [
            handleIdentifier.handler(source, node),
          ]);
        case 'BinaryExpression':
          if (
            node.operator === '+' &&
            (node.left.type === 'StringLiteral' ||
              node.right.type === 'StringLiteral')
          ) {
            return handleBinaryExpression.handler(source, node);
          }
          return callExpression(identifier('tostring'), [
            handleBinaryExpression.handler(source, node),
          ]);
        default:
          return defaultHandler(source, node);
      }
    }
  );

  return createHandler('MemberExpression', (source, node: MemberExpression):
    | LuaIndexExpression
    | LuaMemberExpression => {
    if (!node.computed) {
      return memberExpression(
        handleExpression(source, node.object),
        '.',
        handleExpression(source, node.property as Expression) as LuaIdentifier
      );
    }
    return indexExpression(
      handleExpression(source, node.object),
      handleIndex(source, node.property)
    );
  });
};
