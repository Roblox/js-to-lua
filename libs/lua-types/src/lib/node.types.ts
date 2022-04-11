import { hasOwnProperty } from '@js-to-lua/shared-utils';
import { LuaComment } from './comment';
import { LuaNode } from './lua-nodes.types';

export interface BaseLuaNode {
  type: string;
  extras?: Record<string, unknown>;
  leadingComments?: ReadonlyArray<LuaComment>;
  innerComments?: ReadonlyArray<LuaComment>;
  trailingComments?: ReadonlyArray<LuaComment>;
}

type NodeTypeCheck<T extends BaseLuaNode> = (node: BaseLuaNode) => node is T;

export const isLuaNode = (obj: unknown): obj is BaseLuaNode =>
  obj != null &&
  typeof obj === 'object' &&
  hasOwnProperty(obj, 'type') &&
  typeof obj.type === 'string';

export const isNodeType =
  <T extends LuaNode>(type: T['type']): NodeTypeCheck<T> =>
  (node: BaseLuaNode): node is T =>
    node.type === type;

export const isAnyNodeType = <T extends BaseLuaNode>(
  isNodeTypeChecks: Array<NodeTypeCheck<T>>
): NodeTypeCheck<T> =>
  ((node: LuaNode) =>
    isNodeTypeChecks.some((nodeTypeCheck) =>
      nodeTypeCheck(node)
    )) as NodeTypeCheck<T>;
