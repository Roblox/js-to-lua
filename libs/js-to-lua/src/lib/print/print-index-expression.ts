import {
  LuaExpression,
  LuaIndexExpression,
  LuaNumericLiteral,
  LuaStringLiteral,
} from '@js-to-lua/lua-types';
import { printNode } from './print-node';

const getIndex = (
  index: LuaNumericLiteral | LuaStringLiteral | LuaExpression
): string => {
  switch (index.type) {
    case 'NumericLiteral':
      return index.value.toString();
    case 'StringLiteral':
      return `"${index.value}"`;
    default:
      return printNode(index);
  }
};

export const printIndexExpression = (node: LuaIndexExpression) => {
  return `${printNode(node.base)}[${getIndex(node.index)}]`;
};
