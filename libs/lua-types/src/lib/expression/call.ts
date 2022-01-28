import { LuaExpression } from './expression';
import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaCallExpression extends BaseLuaNode {
  type: 'CallExpression';
  callee: LuaExpression;
  arguments: LuaExpression[];
}

export const callExpression = (
  callee: LuaCallExpression['callee'],
  args: LuaCallExpression['arguments']
): LuaCallExpression => ({
  type: 'CallExpression',
  callee,
  arguments: args,
});

export const isCallExpression = isNodeType<LuaCallExpression>('CallExpression');
