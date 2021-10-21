import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaExpression } from '../expression';

export interface LuaTableExpressionKeyField extends BaseLuaNode {
  type: 'TableExpressionKeyField';
  key: LuaExpression;
  value: LuaExpression;
}

export const tableExpressionKeyField = (
  key: LuaTableExpressionKeyField['key'],
  value: LuaTableExpressionKeyField['value']
): LuaTableExpressionKeyField => ({
  type: 'TableExpressionKeyField',
  key,
  value,
});

export const isTableExpressionKeyField = isNodeType<LuaTableExpressionKeyField>(
  'TableExpressionKeyField'
);
