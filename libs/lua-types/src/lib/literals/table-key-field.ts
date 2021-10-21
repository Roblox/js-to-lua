import { isIdentifier, LuaExpression } from '../expression';
import {
  LuaTableNameKeyField,
  tableNameKeyField,
} from './table-name-key-field';
import {
  LuaTableExpressionKeyField,
  tableExpressionKeyField,
} from './table-expression-key-field';

export type LuaTableKeyField =
  | LuaTableNameKeyField
  | LuaTableExpressionKeyField;

export function tableKeyField(
  computed: boolean,
  key: LuaExpression,
  value: LuaExpression
) {
  return computed || !isIdentifier(key)
    ? tableExpressionKeyField(key, value)
    : tableNameKeyField(key, value);
}
