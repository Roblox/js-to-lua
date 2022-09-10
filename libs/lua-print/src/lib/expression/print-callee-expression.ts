import { LuaExpression } from '@js-to-lua/lua-types';
import { fmt, PrintableNode } from '@js-to-lua/shared-utils';
import { PrintNode } from '../print-node';

export const createPrintCalleeExpression = (printNode: PrintNode) => {
  return (callee: LuaExpression): string | PrintableNode => {
    switch (callee.type) {
      case 'CallExpression':
      case 'Identifier':
      case 'LuaMemberExpression':
      case 'IndexExpression':
        return printNode(callee);
      default:
        return fmt`(${printNode(callee)})`;
    }
  };
};
