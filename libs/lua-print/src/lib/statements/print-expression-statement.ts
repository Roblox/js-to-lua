import { LuaExpressionStatement } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';
import { PrinterFunction } from '../printer-function';

export const createPrintExpressionStatement = (
  printNode: PrintNode
): PrinterFunction<LuaExpressionStatement> => {
  return (node: LuaExpressionStatement) => `${printNode(node.expression)};`;
};
