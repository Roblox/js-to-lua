import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaTableExpressionKeyField } from './table-expression-key-field';
import { LuaTableNameKeyField } from './table-name-key-field';
import { LuaTableNoKeyField } from './table-no-key-field';

export type LuaTableField =
  | LuaTableNoKeyField
  | LuaTableNameKeyField
  | LuaTableExpressionKeyField;

export interface LuaTableConstructor<
  F extends LuaTableField[] = LuaTableField[]
> extends BaseLuaNode {
  type: 'TableConstructor';
  readonly elements: F;
}

export const tableConstructor = <F extends LuaTableField[] = LuaTableField[]>(
  elements: LuaTableConstructor<F>['elements'] = [] as unknown as F // TODO
): LuaTableConstructor<F> => ({
  type: 'TableConstructor',
  elements,
});

export const isTableConstructor =
  isNodeType<LuaTableConstructor>('TableConstructor');
