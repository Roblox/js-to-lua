import { LuaNode, LuaType } from '@js-to-lua/lua-types';

export const createPrintBaseType =
  (printNode: (node: LuaNode) => string) =>
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
