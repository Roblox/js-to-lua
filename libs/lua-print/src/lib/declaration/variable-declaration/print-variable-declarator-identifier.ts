import { LuaVariableDeclaratorIdentifier } from '@js-to-lua/lua-types';
import { PrintNode } from '../../print-node';
import { PrinterFunction } from '../../printer-function';

export const createPrintVariableDeclaratorIdentifier = (
  printNode: PrintNode
): PrinterFunction<LuaVariableDeclaratorIdentifier> => {
  return (node) => printNode(node.value);
};
