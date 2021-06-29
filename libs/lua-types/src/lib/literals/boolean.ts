import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaBooleanLiteral extends BaseLuaNode {
  type: 'BooleanLiteral';
  value: boolean;
}

export const booleanLiteral = (
  value: LuaBooleanLiteral['value']
): LuaBooleanLiteral => ({
  type: 'BooleanLiteral',
  value,
});

export const isBooleanLiteral = isNodeType<LuaBooleanLiteral>('BooleanLiteral');
