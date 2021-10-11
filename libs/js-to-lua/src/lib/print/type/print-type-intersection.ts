import { LuaNode, LuaTypeIntersection } from '@js-to-lua/lua-types';

export const createPrintTypeIntersection = (
  printNode: (node: LuaNode) => string
) => (node: LuaTypeIntersection): string =>
  node.types.map(printNode).join(' & ');
