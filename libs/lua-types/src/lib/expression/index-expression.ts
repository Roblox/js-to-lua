import { LuaExpression } from './expression';
import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaIndexExpression extends BaseLuaNode {
  type: 'IndexExpression';
  base: LuaExpression;
  index: LuaExpression;
}

export const indexExpression = (
  base: LuaIndexExpression['base'],
  index: LuaIndexExpression['index']
): LuaIndexExpression => ({
  type: 'IndexExpression',
  base,
  index,
});

export const isIndexExpression =
  isNodeType<LuaIndexExpression>('IndexExpression');
