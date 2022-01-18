import { LuaTypeIntersection } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintTypeIntersection =
  (printNode: PrintNode) =>
  (node: LuaTypeIntersection): string =>
    node.types.map((n) => printNode(n)).join(' & ');
