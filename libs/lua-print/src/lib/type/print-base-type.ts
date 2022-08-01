import { LuaType } from '@js-to-lua/lua-types';
import { PrintableNode } from '@js-to-lua/shared-utils';
import { PrintNode } from '../print-node';

export const createPrintBaseType =
  (printNode: PrintNode) =>
  (base: LuaType): string | PrintableNode => {
    switch (base.type) {
      case 'LuaTypeAny':
      case 'LuaTypeNil':
      case 'LuaTypeBoolean':
      case 'LuaTypeNumber':
      case 'LuaTypeString':
      case 'TypeReference':
      case 'LuaTypeLiteral':
        return printNode(base);
      default:
        return `(${printNode(base)})`;
    }
  };
