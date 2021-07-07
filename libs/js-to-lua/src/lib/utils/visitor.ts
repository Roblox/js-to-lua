import { LuaNode } from '@js-to-lua/lua-types';

export type Visitor = (node: LuaNode) => void;

const isLuaNodeLike = (node: unknown): node is LuaNode =>
  typeof node === 'object' &&
  node !== null &&
  typeof (node as any).type === 'string';

export const visit = (root: LuaNode, visitor: Visitor) => {
  const queue = [root];
  while (queue.length) {
    const node = queue.pop()!;
    visitor(node);
    const children = Object.values(node).flat().filter(isLuaNodeLike);
    queue.push(...children.reverse());
  }
};
