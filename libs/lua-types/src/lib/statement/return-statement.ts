import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaExpression } from '../expression';

export interface LuaReturnStatement extends BaseLuaNode {
  type: 'ReturnStatement';
  arguments: LuaExpression[];
}

export const returnStatement = (
  ...arguments_: LuaReturnStatement['arguments']
): LuaReturnStatement => ({
  type: 'ReturnStatement',
  arguments: arguments_,
});

export const isReturnStatement =
  isNodeType<LuaReturnStatement>('ReturnStatement');
