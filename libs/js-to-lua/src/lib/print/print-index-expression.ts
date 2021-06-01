import {
  LuaExpression,
  LuaIndexExpression,
  LuaNumericLiteral,
  LuaStringLiteral,
} from '@js-to-lua/lua-types';
import { printNode } from './print-node';

const getIndex = (
  index: LuaNumericLiteral | LuaStringLiteral | LuaExpression,
  source: string
): string => {
  switch (index.type) {
    case 'NumericLiteral':
      return index.value.toString();
    case 'StringLiteral':
      return `"${index.value}"`;
    default:
      return printNode(index, source);
  }
};

export const printIndexExpression = (
  node: LuaIndexExpression,
  source: string
) => {
  return `${printNode(node.base, source)}[${getIndex(node.index, source)}]${
    node.conversionComment ? ` --[[ ${node.conversionComment} ]]` : ''
  }`;
};
