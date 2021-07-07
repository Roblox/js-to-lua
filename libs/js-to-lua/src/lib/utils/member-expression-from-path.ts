import {
  identifier,
  LuaMemberExpression,
  memberExpression,
} from '@js-to-lua/lua-types';

export const memberExpressionFromPath = (
  path: string[]
): LuaMemberExpression => {
  return (path.reduceRight(
    (right: string | LuaMemberExpression, left) =>
      memberExpression(
        identifier(left),
        '.',
        typeof right === 'string' ? identifier(right) : right
      ) as any
  ) as unknown) as LuaMemberExpression;
};
