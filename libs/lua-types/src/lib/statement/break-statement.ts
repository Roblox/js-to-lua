import { BaseLuaNode, isNodeType } from '../node.types';

export interface BreakStatement extends BaseLuaNode {
  type: 'LuaBreakStatement';
}

export const breakStatement = (): BreakStatement => ({
  type: 'LuaBreakStatement',
});

export const isBreakStatement = isNodeType<BreakStatement>('LuaBreakStatement');
