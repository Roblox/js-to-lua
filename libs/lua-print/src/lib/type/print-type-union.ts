import { isTypeIntersection, LuaTypeUnion } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintTypeUnion =
  (printNode: PrintNode) =>
  (node: LuaTypeUnion): string =>
    node.types
      .map((n) => {
        if (isTypeIntersection(n)) {
          return `(${printNode(n)})`;
        }
        return printNode(n);
      })
      .join(' | ');
