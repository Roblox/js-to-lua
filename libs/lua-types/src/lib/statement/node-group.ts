import { LuaNode } from '../lua-nodes.types';
import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaExpression } from '../expression';
import { LuaStatement } from './statement';

export interface LuaNodeGroup<T extends LuaNode = LuaExpression | LuaStatement>
  extends BaseLuaNode {
  type: 'NodeGroup';
  body: Array<T>;
}

export const nodeGroup = <T extends LuaNode = LuaExpression | LuaStatement>(
  body: LuaNodeGroup<T>['body']
): LuaNodeGroup<T> => ({
  type: 'NodeGroup',
  body,
});

export const isNodeGroup = isNodeType<LuaNodeGroup>('NodeGroup');
