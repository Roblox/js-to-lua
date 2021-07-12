import { LuaIndexExpression } from '@js-to-lua/lua-types';
import { printNode } from './print-node';

export const printIndexExpression = (node: LuaIndexExpression) => {
  return `${printNode(node.base)}[${printNode(node.index)}]`;
};
