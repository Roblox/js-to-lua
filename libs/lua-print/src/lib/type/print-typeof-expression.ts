import { LuaTypeOfExpression } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintTypeOfExpression =
  (printNode: PrintNode) =>
  (node: LuaTypeOfExpression): string => {
    return `typeof(${printNode(node.expression)})`;
  };
