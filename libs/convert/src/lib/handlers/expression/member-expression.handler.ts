import {
  Expression,
  isPrivateName,
  MemberExpression,
  PrivateName,
} from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  defaultExpressionHandler,
  getObjectPropertyExpression,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  indexExpression,
  isIdentifier,
  LuaExpression,
  LuaIndexExpression,
  LuaMemberExpression,
  LuaNumericLiteral,
  LuaStringLiteral,
  memberExpression,
  UnhandledStatement,
} from '@js-to-lua/lua-types';
import { applyTo } from 'ramda';
import { handleNumericLiteral } from '../primitives/numeric.handler';
import { createStringLiteralHandler } from '../primitives/string.handler';
import { createBinaryExpressionHandler } from './binary-expression/binary-expression.handler';

export const createMemberExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
): BaseNodeHandler<
  LuaIndexExpression | LuaMemberExpression,
  MemberExpression
> => {
  const handleBinaryExpression =
    createBinaryExpressionHandler(handleExpression);
  const { handler: handleStringLiteral } = createStringLiteralHandler();
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
          return handleStringLiteral(source, config, node);
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
      const objectExpression = handleExpression(source, config, node.object);
      if (!node.computed) {
        const propertyExpression = isPrivateName(node.property)
          ? defaultExpressionHandler(source, config, node.property)
          : applyTo(handleExpression(source, config, node.property))(
              (expression) =>
                getObjectPropertyExpression(expression) || expression
            );

        return isIdentifier(propertyExpression)
          ? memberExpression(objectExpression, '.', propertyExpression)
          : indexExpression(objectExpression, propertyExpression);
      }
      return indexExpression(
        objectExpression,
        handleIndex(source, config, node.property)
      );
    }
  );
};
