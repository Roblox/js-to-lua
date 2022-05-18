import { Expression, SwitchCase } from '@babel/types';
import { LuaExpression, LuaStatement } from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';

export type DefaultSwitchCase = Omit<SwitchCase, 'test'> & { test: null };
export type NotDefaultSwitchCase = Omit<SwitchCase, 'test'> & {
  test: Expression;
};
export const isDefaultSwitchCase = (
  node: SwitchCase
): node is DefaultSwitchCase => !isNotDefaultSwitchCase(node);
export const isNotDefaultSwitchCase = (
  node: SwitchCase
): node is NotDefaultSwitchCase => isTruthy(node.test);

export interface HandledNotDefaultCase {
  test: LuaExpression;
  consequent: LuaStatement[];
}
