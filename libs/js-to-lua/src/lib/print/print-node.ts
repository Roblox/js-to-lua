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
      return `"${node.value}"`;
    case 'BooleanLiteral':
      return node.value.toString();
    case 'TableConstructor':
      return `{ ${node.elements.map((e) => printNode(e, source)).join(', ')} }`;
    case 'TableNoKeyField':
      return printNode(node.value, source);
    case 'UnhandledNode':
      return `
--[[
${source.slice(node.start, node.end)}
]]
      `;
    default:
      return '--[[ default ]]';
  }
};
