import {
  identifier,
  indexExpression,
  LuaIndexExpression,
  LuaMemberExpression,
  memberExpression,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { isValidIdentifier } from './valid-identifier';

export const memberExpressionFromPath = (
  path: string[]
): LuaMemberExpression | LuaIndexExpression => {
  return path.reduce(
    (left: string | LuaMemberExpression | LuaIndexExpression, right) => {
      const leftExpression = typeof left === 'string' ? identifier(left) : left;
      const validIdentifier = isValidIdentifier(right);
      return (
        validIdentifier
          ? memberExpression(leftExpression, '.', identifier(right))
          : indexExpression(leftExpression, stringLiteral(right))
      ) as any;
    }
  ) as unknown as LuaMemberExpression | LuaIndexExpression;
};
