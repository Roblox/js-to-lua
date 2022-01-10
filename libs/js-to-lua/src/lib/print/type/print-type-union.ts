import { LuaNode, LuaTypeUnion } from '@js-to-lua/lua-types';

export const createPrintTypeUnion =
  (printNode: (node: LuaNode) => string) =>
  (node: LuaTypeUnion): string =>
    node.types.map(printNode).join(' | ');
