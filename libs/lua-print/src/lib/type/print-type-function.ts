import { LuaTypeFunction } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintTypeFunction =
  (printNode: PrintNode) =>
  (node: LuaTypeFunction): string => {
    return `(${node.parameters
      .map((n) => printNode(n))
      .join(', ')}) -> ${printNode(node.returnType)}`;
  };
