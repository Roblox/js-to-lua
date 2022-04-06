import { LuaTableNameKeyField } from '@js-to-lua/lua-types';
import { PrintNode } from '../../print-node';
import { PrinterFunction } from '../../printer-function';

export const createPrintTableKeyField = (
  printNode: PrintNode
): PrinterFunction<LuaTableNameKeyField> => {
  return (node): string => `${printNode(node.key)} = ${printNode(node.value)}`;
};
