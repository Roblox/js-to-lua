import { Expression, ObjectProperty } from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { getObjectPropertyExpression } from '@js-to-lua/lua-conversion-utils';
import {
  indexExpression,
  isIdentifier,
  LuaExpression,
  LuaIdentifier,
  LuaIndexExpression,
  LuaMemberExpression,
  memberExpression,
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
        const propertyExpression = getObjectPropertyExpression(expression);

        return propertyExpression || expression;
      }
    );

    return !property.computed && isIdentifier(resultExpression)
      ? memberExpression(base, '.', resultExpression)
      : indexExpression(base, resultExpression);
  });
