import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaStatement } from './statement';

export interface LuaNodeGroup<T extends LuaStatement = LuaStatement>
  extends BaseLuaNode {
  type: 'NodeGroup';
  body: Array<T>;
}

export const nodeGroup = <T extends LuaStatement = LuaStatement>(
  body: LuaNodeGroup<T>['body']
): LuaNodeGroup<T> => ({
  type: 'NodeGroup',
  body,
});

export const isNodeGroup = isNodeType<LuaNodeGroup>('NodeGroup');
