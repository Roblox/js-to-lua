import { BaseLuaNode, isNodeType } from '../node.types';

export interface ContinueStatement extends BaseLuaNode {
  type: 'ContinueStatement';
}

export const continueStatement = (): ContinueStatement => ({
  type: 'ContinueStatement',
});

export const isContinueStatement =
  isNodeType<ContinueStatement>('ContinueStatement');
