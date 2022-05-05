import {
  isBinaryExpression,
  isIfExpression,
  isMultilineStringLiteral,
  isStringLiteral,
  LuaExpression,
  LuaIfExpression,
  LuaNode,
} from '@js-to-lua/lua-types';
import { withExtras } from './extras';

export const stringInferableExpression = <N extends LuaNode>(node: N) =>
  withExtras<{ isStringInferable: true }, N>({
    isStringInferable: true,
  })(node);

export const isStringInferable = (
  node: LuaExpression & { extras?: { isStringInferable?: boolean } }
): boolean =>
  isStringLiteral(node) ||
  isMultilineStringLiteral(node) ||
  (isBinaryExpression(node) && node.operator === '..') ||
  (isIfExpression(node) && isIfExpressionStringInferable(node)) ||
  !!node.extras?.isStringInferable;

export const isIfExpressionStringInferable = (
  node: LuaIfExpression
): boolean => {
  return [node.ifClause, node.elseClause, ...(node.elseifClauses || [])].every(
    (clause) => isStringInferable(clause.body)
  );
};
