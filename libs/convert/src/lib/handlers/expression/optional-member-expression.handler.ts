import { Expression, OptionalMemberExpression } from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  getOriginalIdentifierNameExtra,
  isWithOriginalIdentifierNameExtras,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  callExpression,
  elseExpressionClause,
  identifier,
  ifElseExpression,
  ifExpressionClause,
  indexExpression,
  isIdentifier,
  LuaExpression,
  memberExpression,
  nilLiteral,
  stringLiteral,
  unhandledExpression,
} from '@js-to-lua/lua-types';
import { applyTo } from 'ramda';

export const createOptionalMemberExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  return createHandler<LuaExpression, OptionalMemberExpression>(
    'OptionalMemberExpression',
    (source, config, node) => {
      const objectExpression = handleExpression(source, config, node.object);
      const propertyExpression = applyTo(
        handleExpression(source, config, node.property)
      )((expression) =>
        isWithOriginalIdentifierNameExtras(expression)
          ? stringLiteral(getOriginalIdentifierNameExtra(expression))
          : expression
      );

      if (!node.optional) {
        return withTrailingConversionComment(
          unhandledExpression(),
          `ROBLOX TODO: Unhandled node for type: ${node.type} when optional property is not true`,
          getNodeSource(source, node)
        );
      }

      return ifElseExpression(
        ifExpressionClause(
          binaryExpression(
            callExpression(identifier('typeof'), [objectExpression]),
            '==',
            stringLiteral('table')
          ),
          !node.computed && isIdentifier(propertyExpression)
            ? memberExpression(objectExpression, '.', propertyExpression)
            : indexExpression(objectExpression, propertyExpression)
        ),
        elseExpressionClause(nilLiteral())
      );
    }
  );
};
