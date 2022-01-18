import { LuaType } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintBaseType =
  (printNode: PrintNode) =>
  (base: LuaType): string => {
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
