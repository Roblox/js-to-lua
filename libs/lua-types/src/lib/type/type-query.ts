import { LuaIdentifier } from '../expression';
import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaTypeQuery extends BaseLuaNode {
  type: 'LuaTypeQuery';
  expression: LuaIdentifier;
}

export const typeQuery = (
  expression: LuaTypeQuery['expression']
): LuaTypeQuery => ({
  type: 'LuaTypeQuery',
  expression,
});

export const isTypeQuery = isNodeType<LuaTypeQuery>('LuaTypeQuery');
