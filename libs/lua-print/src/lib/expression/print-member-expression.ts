import { LuaMemberExpression } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';
import { createPrintBaseExpression } from './print-base-expression';

export const createPrintMemberExpression = (printNode: PrintNode) => {
  const printBaseExpression = createPrintBaseExpression(printNode);
  return (node: LuaMemberExpression): string => {
    return `${printBaseExpression(node.base)}${node.indexer}${printNode(
      node.identifier
    )}`;
  };
};
