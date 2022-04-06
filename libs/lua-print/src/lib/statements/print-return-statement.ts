import { LuaReturnStatement } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';
import { PrinterFunction } from '../printer-function';

export const createPrintReturnStatement = (
  printNode: PrintNode
): PrinterFunction<LuaReturnStatement> => {
  return (node) =>
    `return ${node.arguments.map((arg) => printNode(arg)).join(', ')};`;
};
