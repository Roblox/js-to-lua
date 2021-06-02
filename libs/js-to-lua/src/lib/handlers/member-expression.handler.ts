import { BaseNodeHandler, HandlerFunction } from '../types';
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
  unhandledNode,
  UnhandledNode,
} from '@js-to-lua/lua-types';
import {
  handleBinaryExpression,
  handleIdentifier,
} from './expression-statement.handler';
import { handleNumericLiteral } from './primitives/numeric.handler';
import { handleStringLiteral } from './primitives/string.handler';
import { handleBooleanLiteral } from './primitives/boolean.handler';

export const createMemberExpressionHandler = (
  handleExpression: HandlerFunction<Expression, LuaExpression>
): BaseNodeHandler<
  MemberExpression,
  LuaIndexExpression | LuaMemberExpression
> => {
  const handleIndex = (
    node: Expression | PrivateName
  ): LuaStringLiteral | LuaNumericLiteral | LuaExpression | UnhandledNode => {
    switch (node.type) {
      case 'NumericLiteral':
        return handleNumericLiteral.handler({ ...node, value: node.value + 1 });
      case 'StringLiteral':
        return handleStringLiteral.handler(node);
      case 'BooleanLiteral':
        return callExpression(identifier('tostring'), [
          handleBooleanLiteral.handler(node),
        ]);
      case 'Identifier':
        return callExpression(identifier('tostring'), [
          handleIdentifier.handler(node),
        ]);
      case 'BinaryExpression':
        return callExpression(identifier('tostring'), [
          handleBinaryExpression.handler(node),
        ]);
      default:
        return unhandledNode(node.start, node.end);
    }
  };

  const handler = (
    node: MemberExpression
  ): LuaIndexExpression | LuaMemberExpression => {
    if (!node.computed) {
      return memberExpression(
        handleExpression(node.object),
        '.',
        handleExpression(node.property as Expression) as LuaIdentifier
      );
    }
    return indexExpression(
      handleExpression(node.object),
      handleIndex(node.property)
    );
  };

  return {
    type: 'MemberExpression',
    handler,
  };
};
