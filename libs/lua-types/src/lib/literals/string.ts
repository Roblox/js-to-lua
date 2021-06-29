import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaStringLiteral extends BaseLuaNode {
  type: 'StringLiteral';
  value: string;
  extra?: {
    raw?: string;
  };
}

export const stringLiteral = (
  value: LuaStringLiteral['value']
): LuaStringLiteral => ({
  type: 'StringLiteral',
  value,
});

export const isStringLiteral = isNodeType<LuaStringLiteral>('StringLiteral');
