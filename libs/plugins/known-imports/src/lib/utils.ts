import {
  isCallExpression,
  isIdentifier,
  isStringLiteral,
  LuaCallExpression,
  LuaExpression,
  LuaIdentifier,
  LuaNode,
  LuaStringLiteral,
} from '@js-to-lua/lua-types';

export type RequireCall = Omit<LuaCallExpression, 'callee' | 'arguments'> & {
  callee: LuaIdentifier & { name: 'require' };
  arguments: [LuaExpression];
};

export const isRequire = (node: LuaNode): node is RequireCall => {
  return (
    isCallExpression(node) &&
    isIdentifier(node.callee) &&
    node.callee.name === 'require' &&
    node.arguments.length === 1
  );
};

export const isExactIdentifier =
  <N extends string>(name: N) =>
  (node: LuaExpression): node is Omit<LuaIdentifier, 'name'> & { name: N } => {
    return isIdentifier(node) && node.name === name;
  };

export const isExactStringLiteral =
  <N extends string>(value: N) =>
  (
    node: LuaExpression
  ): node is Omit<LuaStringLiteral, 'value'> & { value: N } => {
    return isStringLiteral(node) && node.value === value;
  };
