import { LuaIndexExpression, LuaNode } from '@js-to-lua/lua-types';
import { createPrintBaseExpression } from './print-base-expression';

export const createPrintIndexExpression = (
  printNode: (node: LuaNode) => string
) => (node: LuaIndexExpression) => {
  const printBaseExpression = createPrintBaseExpression(printNode);
  return `${printBaseExpression(node.base)}[${printNode(node.index)}]`;
};
