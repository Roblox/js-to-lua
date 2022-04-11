import { Expression, ObjectProperty } from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getAlternativeExpressionExtra,
  getOriginalIdentifierNameExtra,
  isValidIdentifier,
  isWithAlternativeExpressionExtras,
  isWithOriginalIdentifierNameExtras,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  indexExpression,
  isIdentifier,
  LuaExpression,
  LuaIdentifier,
  LuaIndexExpression,
  LuaMemberExpression,
  memberExpression,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { applyTo } from 'ramda';

export const createPropertyFromBaseHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  base: LuaIdentifier | LuaMemberExpression | LuaIndexExpression
) =>
  createHandlerFunction<
    LuaMemberExpression | LuaIndexExpression,
    ObjectProperty
  >((source, config, property) => {
    const resultExpression = applyTo(
      handleExpression(source, config, property.key),
      (expression) => {
        if (property.computed) {
          return expression;
        }

        if (isWithAlternativeExpressionExtras(expression)) {
          return getAlternativeExpressionExtra(expression);
        } else if (isWithOriginalIdentifierNameExtras(expression)) {
          const originalIdentifierName =
            getOriginalIdentifierNameExtra(expression);
          if (isValidIdentifier(originalIdentifierName)) {
            return identifier(originalIdentifierName);
          } else {
            return stringLiteral(originalIdentifierName);
          }
        } else {
          return expression;
        }
      }
    );

    return !property.computed && isIdentifier(resultExpression)
      ? memberExpression(base, '.', resultExpression)
      : indexExpression(base, resultExpression);
  });
