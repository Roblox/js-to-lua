import {
  LuaBooleanLiteral,
  LuaCallExpression,
  LuaIdentifier,
  LuaMemberExpression,
  LuaMultilineStringLiteral,
  LuaNilLiteral,
  LuaNode,
  LuaNumericLiteral,
  LuaStringLiteral,
  LuaUnaryNegationExpression,
} from './lua-nodes.types';

const isNodeType = <T extends LuaNode>(type: T['type']) => (
  node: LuaNode
): node is T => node.type === type;

export const isBooleanLiteral = isNodeType<LuaBooleanLiteral>('BooleanLiteral');
export const isNumericLiteral = isNodeType<LuaNumericLiteral>('NumericLiteral');
export const isMultilineStringLiteral = isNodeType<LuaMultilineStringLiteral>(
  'MultilineStringLiteral'
);
export const isStringLiteral = isNodeType<LuaStringLiteral>('StringLiteral');
export const isNilLiteral = isNodeType<LuaNilLiteral>('NilLiteral');
export const isCallExpression = isNodeType<LuaCallExpression>('CallExpression');
export const isMemberExpression = isNodeType<LuaMemberExpression>(
  'LuaMemberExpression'
);
export const isIdentifier = isNodeType<LuaIdentifier>('Identifier');
export const isUnaryNegation = isNodeType<LuaUnaryNegationExpression>(
  'LuaUnaryNegationExpression'
);
