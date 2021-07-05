import { LuaNode } from './lua-nodes.types';

export interface BaseLuaNode {
  type: string;
  conversionComments?: string[];
  extras?: Record<string, unknown>;
}

type NodeTypeCheck<T extends LuaNode> = (node: LuaNode) => node is T;

export const isNodeType = <T extends LuaNode>(
  type: T['type']
): NodeTypeCheck<T> => (node: LuaNode): node is T => node.type === type;

export const isAnyNodeType = <T extends LuaNode>(
  isNodeTypeChecks: Array<NodeTypeCheck<T>>
): NodeTypeCheck<T> =>
  ((node: LuaNode) =>
    isNodeTypeChecks.some((nodeTypeCheck) =>
      nodeTypeCheck(node)
    )) as NodeTypeCheck<T>;
