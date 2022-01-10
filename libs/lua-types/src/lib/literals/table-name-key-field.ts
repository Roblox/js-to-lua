import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaExpression, LuaIdentifier } from '../expression';

export interface LuaTableNameKeyField extends BaseLuaNode {
  type: 'TableNameKeyField';
  key: LuaIdentifier;
  value: LuaExpression;
}

export const tableNameKeyField = (
  key: LuaTableNameKeyField['key'],
  value: LuaTableNameKeyField['value']
): LuaTableNameKeyField => ({
  type: 'TableNameKeyField',
  key,
  value,
});

export const isTableNameKeyField =
  isNodeType<LuaTableNameKeyField>('TableNameKeyField');
