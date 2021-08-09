import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaExpression } from '../expression';
import { LuaStatement } from './statement';

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
