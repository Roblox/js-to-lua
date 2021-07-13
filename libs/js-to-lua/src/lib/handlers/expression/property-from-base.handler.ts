import { createHandlerFunction, HandlerFunction } from '../../types';
import {
  identifier,
  indexExpression,
  LuaExpression,
  LuaIdentifier,
  LuaIndexExpression,
  LuaMemberExpression,
  memberExpression,
} from '@js-to-lua/lua-types';
import { Expression, isIdentifier, ObjectProperty } from '@babel/types';

export const createPropertyFromBaseHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  base: LuaIdentifier | LuaMemberExpression | LuaIndexExpression
) =>
  createHandlerFunction<
    LuaMemberExpression | LuaIndexExpression,
    ObjectProperty
  >((source, config, property) =>
    isIdentifier(property.key) && !property.computed
      ? memberExpression(base, '.', identifier(property.key.name))
      : indexExpression(base, handleExpression(source, config, property.key))
  );
