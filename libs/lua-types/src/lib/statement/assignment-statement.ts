import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaExpression, LuaLVal } from '../lua-nodes.types';

export enum AssignmentStatementOperatorEnum {
  EQ = '=',
  ADD = '+=',
  SUB = '-=',
  DIV = '/=',
  MUL = '*=',
  REMAINDER = '%=',
  CONCAT = '..=',
}

export type AssignmentStatementOperator =
  | AssignmentStatementOperatorEnum.EQ
  | AssignmentStatementOperatorEnum.ADD
  | AssignmentStatementOperatorEnum.SUB
  | AssignmentStatementOperatorEnum.DIV
  | AssignmentStatementOperatorEnum.MUL
  | AssignmentStatementOperatorEnum.REMAINDER
  | AssignmentStatementOperatorEnum.CONCAT;

export interface AssignmentStatement extends BaseLuaNode {
  type: 'AssignmentStatement';
  identifiers: LuaLVal[];
  values: LuaExpression[];
  operator: AssignmentStatementOperator;
}

export const assignmentStatement = (
  operator: AssignmentStatement['operator'],
  identifiers: AssignmentStatement['identifiers'],
  values: AssignmentStatement['values']
): AssignmentStatement => ({
  type: 'AssignmentStatement',
  identifiers,
  values,
  operator,
});

export const isAssignmentStatement = isNodeType<AssignmentStatement>(
  'AssignmentStatement'
);
