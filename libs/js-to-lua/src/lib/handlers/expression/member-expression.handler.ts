import { Expression, MemberExpression, PrivateName } from '@babel/types';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
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
  UnhandledStatement,
} from '@js-to-lua/lua-types';
import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../../types';
import { defaultExpressionHandler } from '../../utils/default-handlers';
import { handleNumericLiteral } from '../primitives/numeric.handler';
import { handleStringLiteral } from '../primitives/string.handler';
import { createBinaryExpressionHandler } from './binary-expression.handler';

export const createMemberExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
): BaseNodeHandler<
  LuaIndexExpression | LuaMemberExpression,
  MemberExpression
> => {
  const handleBinaryExpression =
    createBinaryExpressionHandler(handleExpression);
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
          return withTrailingConversionComment(
            handleNumericLiteral.handler(source, config, {
              ...node,
              value: node.value + 1,
              extra: undefined,
            }),
            'ROBLOX adaptation: added 1 to array index'
          );
        case 'StringLiteral':
          return handleStringLiteral.handler(source, config, node);
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
        case 'PrivateName':
          return defaultExpressionHandler(source, config, node);
        default:
          return callExpression(identifier('tostring'), [
            handleExpression(source, config, node),
          ]);
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
