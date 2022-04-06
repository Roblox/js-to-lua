import { LuaTableConstructor } from '@js-to-lua/lua-types';
import { PrintNode } from '../../print-node';
import { PrinterFunction } from '../../printer-function';

export const createPrintTableConstructor = (
  printNode: PrintNode
): PrinterFunction<LuaTableConstructor> => {
  return (node) => `{${node.elements.map((e) => printNode(e)).join(', ')}}`;
};
