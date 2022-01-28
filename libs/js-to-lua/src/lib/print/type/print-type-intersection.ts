import { isTypeUnion, LuaTypeIntersection } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintTypeIntersection =
  (printNode: PrintNode) =>
  (node: LuaTypeIntersection): string =>
    node.types
      .map((n) => {
        if (isTypeUnion(n)) {
          return `(${printNode(n)})`;
        }
        return printNode(n);
      })
      .join(' & ');
