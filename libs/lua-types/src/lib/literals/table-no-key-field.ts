import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaExpression } from '../expression';

export interface LuaTableNoKeyField extends BaseLuaNode {
  type: 'TableNoKeyField';
  value: LuaExpression;
}

export const tableNoKeyField = (
  value: LuaTableNoKeyField['value']
): LuaTableNoKeyField => ({
  type: 'TableNoKeyField',
  value,
});

export const isTableNoKeyField = isNodeType<LuaTableNoKeyField>(
  'TableNoKeyField'
);
