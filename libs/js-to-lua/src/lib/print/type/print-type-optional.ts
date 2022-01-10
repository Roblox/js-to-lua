import { LuaNode, LuaTypeOptional } from '@js-to-lua/lua-types';
import { createPrintBaseType } from './print-base-type';

export const createPrintTypeOptional =
  (printNode: (node: LuaNode) => string) =>
  (node: LuaTypeOptional): string => {
    const printBaseType = createPrintBaseType(printNode);
    return `${printBaseType(node.typeAnnotation)}?`;
  };
