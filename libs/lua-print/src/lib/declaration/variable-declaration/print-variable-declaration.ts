import { LuaVariableDeclaration } from '@js-to-lua/lua-types';
import { PrintNode } from '../../print-node';
import { PrinterFunction } from '../../printer-function';

export const createPrintVariableDeclaration = (
  printNode: PrintNode
): PrinterFunction<LuaVariableDeclaration> => {
  return (node) => printNode(node, printVariableDeclaration);

  function printVariableDeclaration(node: LuaVariableDeclaration): string {
    const identifiers = node.identifiers.map((id) => printNode(id)).join(', ');
    const initializers = node.values.length
      ? ` = ${node.values.map((value) => printNode(value)).join(', ')}`
      : '';
    return `local ${identifiers}${initializers};`;
  }
};
