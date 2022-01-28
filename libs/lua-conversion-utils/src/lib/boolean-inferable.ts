import {
  isBinaryExpression,
  isBooleanLiteral,
  isCallExpression,
  isIdentifier,
  isMemberExpression,
  isUnaryNegation,
  LuaExpression,
  LuaIdentifier,
  LuaMemberExpression,
} from '@js-to-lua/lua-types';
import { booleanMethod } from './creators';
import { withExtras } from './extras';

export const booleanInferableExpression = withExtras({
  isBooleanInferable: true,
});

export const isBooleanInferable = (
  node: LuaExpression & { extras?: { isBooleanInferable?: boolean } }
) =>
  isBooleanLiteral(node) ||
  isUnaryNegation(node) ||
  (isBinaryExpression(node) && node.operator === '==') ||
  (isBinaryExpression(node) && node.operator === '~=') ||
  (isBinaryExpression(node) && node.operator === '>') ||
  (isBinaryExpression(node) && node.operator === '<') ||
  (isBinaryExpression(node) && node.operator === '>=') ||
  (isBinaryExpression(node) && node.operator === '<=') ||
  isToJSBooleanMethod(node) ||
  node.extras?.isBooleanInferable === true;

function isToJSBooleanMethod(node: LuaExpression): boolean {
  const { base, identifier } = booleanMethod(
    'toJSBoolean'
  ) as LuaMemberExpression & { base: LuaIdentifier; identifier: LuaIdentifier };

  return (
    isCallExpression(node) &&
    isMemberExpression(node.callee) &&
    node.callee.indexer === '.' &&
    isIdentifier(node.callee.base) &&
    isIdentifier(node.callee.identifier) &&
    node.callee.base.name === base.name &&
    node.callee.identifier.name === identifier.name
  );
}
