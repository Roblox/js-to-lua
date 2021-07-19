import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaExpression, LuaStatement } from '../lua-nodes.types';

export interface LuaNodeGroup extends BaseLuaNode {
  type: 'NodeGroup';
  body: Array<LuaExpression | LuaStatement>;
}

export const nodeGroup = (body: LuaNodeGroup['body']): LuaNodeGroup => ({
  type: 'NodeGroup',
  body,
});

export const isNodeGroup = isNodeType<LuaNodeGroup>('NodeGroup');
