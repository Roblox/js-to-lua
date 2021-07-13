import { withExtras } from './lua-nodes.creators';
import { LuaExpression } from './lua-nodes.types';
import { isMultilineStringLiteral, isStringLiteral } from './literals';
import { isBinaryExpression } from './lua-nodes.checks';

export const stringInferableExpression = withExtras({
  isStringInferable: true,
});

export const isStringInferable = (
  node: LuaExpression & { extras?: { isStringInferable?: boolean } }
) =>
  isStringLiteral(node) ||
  isMultilineStringLiteral(node) ||
  (isBinaryExpression(node) && node.operator === '..') ||
  node.extras?.isStringInferable;
