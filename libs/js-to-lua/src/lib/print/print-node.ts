import { LuaNode } from '../lua-nodes.types';

export const printNode = (node: LuaNode, source: string): string => {
  switch (node.type) {
    case 'Program':
      return node.body.map((node) => printNode(node, source)).join('\n');
    case 'ExpressionStatement':
      return printNode(node.expression, source);
    case 'NumericLiteral':
      return node.value.toString();
    case 'StringLiteral':
      return node.value;
    case 'BooleanLiteral':
      return node.value.toString();
    case 'UnhandledNode':
      return `
--[[
${source.slice(node.start, node.end)}
]]
      `;
    default:
      return '';
  }
};
