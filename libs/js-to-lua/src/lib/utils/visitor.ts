import { LuaNode } from '@js-to-lua/lua-types';
import { lensPath, set } from 'ramda';

export type Visitor<R extends LuaNode = LuaNode> = (node: LuaNode) => R | void;

const isLuaNodeLike = (node: unknown): node is LuaNode =>
  typeof node === 'object' &&
  node !== null &&
  typeof (node as any).type === 'string';

export const visit = <R extends LuaNode, V extends LuaNode>(
  root: R,
  visitor: Visitor<V>
): R | V => {
  let resultRoot: R | V = root;
  const queue: Array<{
    node: LuaNode;
    parent: {
      node: LuaNode;
      path: string;
    } | null;
  }> = [{ node: root, parent: null }];
  while (queue.length) {
    const { node, parent } = queue.pop()!;
    const result = visitor(node);

    if (result) {
      if (parent) {
        replaceNodeInParent(result, parent.node, parent.path);
      } else {
        resultRoot = result;
      }
    }
    const resultNode = result || node;
    const children = Object.entries(node)
      .map(([key, value]) =>
        Array.isArray(value)
          ? value.map((v, index) => ({ key: [key, index].join('.'), value: v }))
          : { key, value }
      )
      .flat()
      .filter(({ value }) => isLuaNodeLike(value));
    queue.push(
      ...children.reverse().map(({ key, value: child }) => ({
        node: child,
        parent: {
          path: key,
          node: resultNode,
        },
      }))
    );
  }
  return resultRoot;
};

function replaceNodeInParent(newNode: LuaNode, parent: LuaNode, path: string) {
  const parent_ = (parent as unknown) as Record<string, unknown>;
  const keyPath = path.split('.').map((v) => (isNaN(+v) ? v : +v));
  const pathLens = lensPath(keyPath);
  const replaceNode = set(pathLens);
  const changed = replaceNode(newNode, parent);
  const firstKey = keyPath[0];
  parent_[firstKey] = changed[firstKey];
}
