import { LuaTypeQuery } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintTypeQuery =
  (printNode: PrintNode) =>
  (node: LuaTypeQuery): string => {
    return `typeof(${printNode(node.expression)})`;
  };
