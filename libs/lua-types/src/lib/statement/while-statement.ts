import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaExpression } from '../expression';
import { LuaNodeGroup } from './node-group';
import { LuaStatement } from './statement';

export interface WhileStatement extends BaseLuaNode {
  type: 'WhileStatement';
  condition: LuaExpression;
  body: LuaNodeGroup<LuaStatement>[];
}

export const whileStatement = (
  condition: WhileStatement['condition'],
  body: WhileStatement['body'] = []
): WhileStatement => ({
  type: 'WhileStatement',
  condition,
  body,
});

export const isWhileStatement = isNodeType<WhileStatement>('WhileStatement');
