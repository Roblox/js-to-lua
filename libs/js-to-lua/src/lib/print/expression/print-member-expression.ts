import { createPrintBaseExpression } from './print-base-expression';
import { LuaMemberExpression, LuaNode } from '@js-to-lua/lua-types';

export const createPrintMemberExpression = (
  printNode: (node: LuaNode) => string
) => {
  const printBaseExpression = createPrintBaseExpression(printNode);
  return (node: LuaMemberExpression): string => {
    return `${printBaseExpression(node.base)}${node.indexer}${printNode(
      node.identifier
    )}`;
  };
};
