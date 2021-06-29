import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaNode } from '../lua-nodes.types';

export interface LuaNodeGroup extends BaseLuaNode {
  type: 'NodeGroup';
  body: LuaNode[];
}

export const nodeGroup = (body: LuaNodeGroup['body']): LuaNodeGroup => ({
  type: 'NodeGroup',
  body,
});

export const isNodeGroup = isNodeType<LuaNodeGroup>('NodeGroup');
