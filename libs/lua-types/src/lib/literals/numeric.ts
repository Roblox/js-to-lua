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
  raw?: string
): LuaNumericLiteral => ({
  type: 'NumericLiteral',
  value,
  extra: raw
    ? {
        raw,
      }
    : undefined,
});

export const isNumericLiteral = isNodeType<LuaNumericLiteral>('NumericLiteral');
