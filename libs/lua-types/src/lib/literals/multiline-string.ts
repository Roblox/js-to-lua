import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaMultilineStringLiteral extends BaseLuaNode {
  type: 'MultilineStringLiteral';
  value: string;
}

export const multilineStringLiteral = (
  value: LuaMultilineStringLiteral['value']
): LuaMultilineStringLiteral => ({
  type: 'MultilineStringLiteral',
  value,
});

export const isMultilineStringLiteral = isNodeType<LuaMultilineStringLiteral>(
  'MultilineStringLiteral'
);
