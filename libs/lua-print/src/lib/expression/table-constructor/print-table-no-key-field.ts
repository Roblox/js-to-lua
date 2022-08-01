import { LuaTableNoKeyField } from '@js-to-lua/lua-types';
import { PrintNode } from '../../print-node';
import { PrinterFunction } from '../../printer-function';

export const createPrintTableNoKeyField = (
  printNode: PrintNode
): PrinterFunction<LuaTableNoKeyField> => {
  return (node) => printNode(node.value);
};
