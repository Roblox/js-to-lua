import {
  isBinaryExpression,
  isIfExpression,
  isLogicalExpression,
  isUnaryExpression,
  isUnaryNegation,
  LuaBinaryExpression,
  LuaIfExpression,
  LuaLogicalExpression,
  LuaNode,
  LuaUnaryExpression,
  LuaUnaryNegationExpression,
} from '@js-to-lua/lua-types';

export const checkPrecedence =
  (
    node:
      | LuaBinaryExpression
      | LuaLogicalExpression
      | LuaUnaryExpression
      | LuaUnaryNegationExpression
      | LuaIfExpression,
    minPrecedence = 1
  ) =>
  (childNode: LuaNode) =>
    Math.sign(getPrecedence(childNode) - getPrecedence(node)) >= minPrecedence;

function getPrecedence(node: LuaNode) {
  if (isBinaryExpression(node) && node.operator === '^') {
    return 1;
  }
  if (
    isUnaryNegation(node) ||
    (isUnaryExpression(node) && node.operator === '-')
  ) {
    return 2;
  }
  if (isBinaryExpression(node) && ['*', '/'].includes(node.operator)) {
    return 3;
  }
  if (isBinaryExpression(node) && ['+', '-'].includes(node.operator)) {
    return 4;
  }
  if (
    isBinaryExpression(node) &&
    ['..', '<', '>', '<=', '>=', '~=', '=='].includes(node.operator)
  ) {
    return 5;
  }
  if (isLogicalExpression(node) && node.operator === 'and') {
    return 6;
  }
  if (isLogicalExpression(node) && node.operator === 'or') {
    return 7;
  }
  if (isIfExpression(node)) {
    return 8;
  }

  return 0;
}
