import { LuaNode, LuaTypeFunction } from '@js-to-lua/lua-types';

export const createPrintTypeFunction =
  (printNode: (node: LuaNode) => string) =>
  (node: LuaTypeFunction): string => {
    return `(${node.parameters.map(printNode).join(', ')}) -> ${printNode(
      node.returnType
    )}`;
  };
