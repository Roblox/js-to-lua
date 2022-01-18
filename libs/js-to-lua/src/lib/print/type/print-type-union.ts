import { LuaTypeUnion } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintTypeUnion =
  (printNode: PrintNode) =>
  (node: LuaTypeUnion): string =>
    node.types.map((n) => printNode(n)).join(' | ');
