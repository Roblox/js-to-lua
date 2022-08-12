import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaStatement } from './statement';

export interface LuaNodeGroup<
  T extends Array<LuaStatement> = Array<LuaStatement>
> extends BaseLuaNode {
  type: 'NodeGroup';
  body: T;
}

export const nodeGroup = <T extends Array<LuaStatement> = Array<LuaStatement>>(
  body: LuaNodeGroup<T>['body']
): LuaNodeGroup<T> => ({
  type: 'NodeGroup',
  body,
});

export const isNodeGroup = isNodeType<LuaNodeGroup>('NodeGroup');
