import { isBooleanLiteral } from './literals';
import {
  isBinaryExpression,
  isCallExpression,
  isIdentifier,
  isMemberExpression,
  isUnaryNegation,
} from './lua-nodes.checks';
import { booleanMethod, withExtras } from './lua-nodes.creators';
import { LuaIdentifier, LuaMemberExpression } from './lua-nodes.types';
import { LuaExpression } from './expression';

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
  node.extras?.isBooleanInferable;

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
