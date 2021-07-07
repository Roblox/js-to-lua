import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../types';
import {
  Expression,
  Identifier,
  MemberExpression,
  PrivateName,
} from '@babel/types';
import {
  callExpression,
  identifier,
  indexExpression,
  LuaBinaryExpression,
  LuaExpression,
  LuaIdentifier,
  LuaIndexExpression,
  LuaMemberExpression,
  LuaNilLiteral,
  LuaNumericLiteral,
  LuaStringLiteral,
  memberExpression,
  UnhandledStatement,
} from '@js-to-lua/lua-types';
import { handleNumericLiteral } from './primitives/numeric.handler';
import { handleStringLiteral } from './primitives/string.handler';
import { handleBooleanLiteral } from './primitives/boolean.handler';
import { createBinaryExpressionHandler } from './binary-expression.handler';
import { defaultStatementHandler } from '../utils/default-handlers';

export const createMemberExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<
    LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression,
    Identifier
  >
): BaseNodeHandler<
  LuaIndexExpression | LuaMemberExpression,
  MemberExpression
> => {
  const handleBinaryExpression = createBinaryExpressionHandler(
    handleExpression
  );
  const handleIndex = createHandlerFunction(
    (
      source,
      config,
      node: Expression | PrivateName
    ):
      | LuaStringLiteral
      | LuaNumericLiteral
      | LuaExpression
      | UnhandledStatement => {
      switch (node.type) {
        case 'NumericLiteral':
          return handleNumericLiteral.handler(source, config, {
            ...node,
            value: node.value + 1,
          });
        case 'StringLiteral':
          return handleStringLiteral.handler(source, config, node);
        case 'BooleanLiteral':
          return callExpression(identifier('tostring'), [
            handleBooleanLiteral.handler(source, config, node),
          ]);
        case 'Identifier':
          return callExpression(identifier('tostring'), [
            handleIdentifier(source, config, node),
          ]);
        case 'BinaryExpression':
          if (
            node.operator === '+' &&
            (node.left.type === 'StringLiteral' ||
              node.right.type === 'StringLiteral')
          ) {
            return handleBinaryExpression.handler(source, config, node);
          }
          return callExpression(identifier('tostring'), [
            handleBinaryExpression.handler(source, config, node),
          ]);
        default:
          return defaultStatementHandler(source, config, node);
      }
    }
  );

  return createHandler(
    'MemberExpression',
    (
      source,
      config,
      node: MemberExpression
    ): LuaIndexExpression | LuaMemberExpression => {
      if (!node.computed) {
        return memberExpression(
          handleExpression(source, config, node.object),
          '.',
          handleExpression(
            source,
            config,
            node.property as Expression
          ) as LuaIdentifier
        );
      }
      return indexExpression(
        handleExpression(source, config, node.object),
        handleIndex(source, config, node.property)
      );
    }
  );
};
