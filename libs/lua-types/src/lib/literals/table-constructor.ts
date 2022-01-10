import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaTableNoKeyField } from './table-no-key-field';
import { LuaTableNameKeyField } from './table-name-key-field';
import { LuaTableExpressionKeyField } from './table-expression-key-field';

export type LuaTableField =
  | LuaTableNoKeyField
  | LuaTableNameKeyField
  | LuaTableExpressionKeyField;

export interface LuaTableConstructor extends BaseLuaNode {
  type: 'TableConstructor';
  elements: LuaTableField[];
}

export const tableConstructor = (
  elements: LuaTableConstructor['elements'] = []
): LuaTableConstructor => ({
  type: 'TableConstructor',
  elements,
});

export const isTableConstructor =
  isNodeType<LuaTableConstructor>('TableConstructor');
