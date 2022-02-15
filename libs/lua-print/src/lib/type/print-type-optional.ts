import { LuaTypeOptional } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';
import { createPrintBaseType } from './print-base-type';

export const createPrintTypeOptional =
  (printNode: PrintNode) =>
  (node: LuaTypeOptional): string => {
    const printBaseType = createPrintBaseType(printNode);
    return `${printBaseType(node.typeAnnotation)}?`;
  };
