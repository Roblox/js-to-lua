import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaStringLiteral extends BaseLuaNode {
  type: 'StringLiteral';
  value: string;
  extra?: {
    raw?: string;
  };
}

export const stringLiteral = (
  value: LuaStringLiteral['value'],
  raw?: string
): LuaStringLiteral => ({
  type: 'StringLiteral',
  value,
  ...(raw ? { extra: { raw } } : {}),
});

export const isStringLiteral = isNodeType<LuaStringLiteral>('StringLiteral');
