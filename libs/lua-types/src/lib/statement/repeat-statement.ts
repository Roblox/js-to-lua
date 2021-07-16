import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaExpression, LuaStatement } from '../lua-nodes.types';

export interface RepeatStatement extends BaseLuaNode {
  type: 'RepeatStatement';
  condition: LuaExpression;
  body: LuaStatement[];
}

export const repeatStatement = (
  condition: RepeatStatement['condition'],
  body: RepeatStatement['body'] = []
): RepeatStatement => ({
  type: 'RepeatStatement',
  condition,
  body,
});

export const isRepeatStatement = isNodeType<RepeatStatement>('RepeatStatement');
