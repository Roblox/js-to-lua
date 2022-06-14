import { LuaExpression } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintBaseExpression =
  (printNode: PrintNode) =>
  (base: LuaExpression): string => {
    switch (base.type) {
      case 'Identifier':
      case 'CallExpression':
      case 'IndexExpression':
      case 'LuaMemberExpression':
        return `${printNode(base)}`;
      default:
        return `(${printNode(base)})`;
    }
  };
