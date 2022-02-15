import { LuaIndexExpression } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';
import { createPrintBaseExpression } from './print-base-expression';

export const createPrintIndexExpression =
  (printNode: PrintNode) => (node: LuaIndexExpression) => {
    const printBaseExpression = createPrintBaseExpression(printNode);
    return `${printBaseExpression(node.base)}[${printNode(node.index)}]`;
  };
