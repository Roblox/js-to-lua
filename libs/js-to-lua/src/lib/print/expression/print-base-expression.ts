import { LuaExpression, LuaNode } from '@js-to-lua/lua-types';

export const createPrintBaseExpression = (
  printNode: (node: LuaNode) => string
) => (base: LuaExpression): string => {
  switch (base.type) {
    case 'Identifier':
    case 'CallExpression':
    case 'LuaBinaryExpression':
    case 'LogicalExpression':
    case 'FunctionExpression':
    case 'IndexExpression':
    case 'LuaMemberExpression':
      return `${printNode(base)}`;
    default:
      return `(${printNode(base)})`;
  }
};
