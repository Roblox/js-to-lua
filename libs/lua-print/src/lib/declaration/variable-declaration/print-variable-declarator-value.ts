import { LuaVariableDeclaratorValue } from '@js-to-lua/lua-types';
import { PrintNode } from '../../print-node';
import { PrinterFunction } from '../../printer-function';

export const createPrintVariableDeclaratorValue = (
  printNode: PrintNode
): PrinterFunction<LuaVariableDeclaratorValue> => {
  return (node) => `${node.value ? `${printNode(node.value)}` : 'nil'}`;
};
