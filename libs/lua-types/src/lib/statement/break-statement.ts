import { BaseLuaNode, isNodeType } from '../node.types';

export interface BreakStatement extends BaseLuaNode {
  type: 'BreakStatement';
}

export const breakStatement = (): BreakStatement => ({
  type: 'BreakStatement',
});

export const isBreakStatement = isNodeType<BreakStatement>('BreakStatement');
