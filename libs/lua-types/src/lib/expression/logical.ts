import { LuaExpression } from './expression';
import { BaseLuaNode, isNodeType } from '../node.types';

export enum LuaLogicalExpressionOperatorEnum {
  AND = 'and',
  OR = 'or',
}

export type LuaLogicalExpressionOperator =
  | LuaLogicalExpressionOperatorEnum.AND
  | LuaLogicalExpressionOperatorEnum.OR;

export interface LuaLogicalExpression extends BaseLuaNode {
  type: 'LogicalExpression';
  operator: LuaLogicalExpressionOperator;
  left: LuaExpression;
  right: LuaExpression;
}

export const logicalExpression = (
  operator: LuaLogicalExpression['operator'],
  left: LuaLogicalExpression['left'],
  right: LuaLogicalExpression['right']
): LuaLogicalExpression => ({
  type: 'LogicalExpression',
  operator,
  left,
  right,
});

export const isLogicalExpression =
  isNodeType<LuaLogicalExpression>('LogicalExpression');
