import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaNumericLiteral extends BaseLuaNode {
  type: 'NumericLiteral';
  value: number;
  extra?: {
    raw?: string;
  };
}

export const numericLiteral = (
  value: LuaNumericLiteral['value'],
  raw?: LuaNumericLiteral['extra']['raw']
): LuaNumericLiteral => ({
  type: 'NumericLiteral',
  value,
  extra: raw && {
    raw,
  },
});

export const isNumericLiteral = isNodeType<LuaNumericLiteral>('NumericLiteral');
