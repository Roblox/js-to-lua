import { LuaExpression } from './expression';
import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaUnaryExpression extends BaseLuaNode {
  type: 'LuaUnaryExpression';
  operator: '-';
  argument: LuaExpression;
}

export const unaryExpression = (
  operator: LuaUnaryExpression['operator'],
  argument: LuaUnaryExpression['argument']
): LuaUnaryExpression => ({
  type: 'LuaUnaryExpression',
  operator,
  argument,
});

export const isUnaryExpression =
  isNodeType<LuaUnaryExpression>('LuaUnaryExpression');
