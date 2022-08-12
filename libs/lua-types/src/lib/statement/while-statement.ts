import { LuaExpression } from '../expression';
import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaNodeGroup } from './node-group';

export interface WhileStatement extends BaseLuaNode {
  type: 'WhileStatement';
  condition: LuaExpression;
  body: LuaNodeGroup[];
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
