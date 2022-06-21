import { LuaExpression } from '../expression';
import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaTypeOfExpression extends BaseLuaNode {
  type: 'LuaTypeOfExpression';
  expression: LuaExpression;
}

export const typeofExpression = (
  expression: LuaTypeOfExpression['expression']
): LuaTypeOfExpression => ({
  type: 'LuaTypeOfExpression',
  expression,
});

export const isTypeOfExpression = isNodeType<LuaTypeOfExpression>(
  'LuaTypeOfExpression'
);
