import { AssignmentExpression, BinaryExpression } from '@babel/types';
import { isStringInferable } from '@js-to-lua/lua-conversion-utils';
import {
  AssignmentStatementOperatorEnum,
  LuaExpression,
} from '@js-to-lua/lua-types';

export const createGetAssignmentStatementOperator = (
  rightExpression: LuaExpression
) => {
  return (
    node: AssignmentExpression
  ): {
    operator?: AssignmentStatementOperatorEnum;
    binary?: BinaryExpression['operator'];
  } => {
    switch (node.operator) {
      case '=':
        return { operator: AssignmentStatementOperatorEnum.EQ };
      case '+=':
        return isStringInferable(rightExpression)
          ? { operator: AssignmentStatementOperatorEnum.CONCAT }
          : { operator: AssignmentStatementOperatorEnum.ADD };
      case '-=':
        return { operator: AssignmentStatementOperatorEnum.SUB };
      case '*=':
        return { operator: AssignmentStatementOperatorEnum.MUL };
      case '/=':
        return { operator: AssignmentStatementOperatorEnum.DIV };
      case '%=':
        return { operator: AssignmentStatementOperatorEnum.REMAINDER };
      case '&=':
        return {
          operator: AssignmentStatementOperatorEnum.EQ,
          binary: '&',
        };
      case '|=':
        return {
          operator: AssignmentStatementOperatorEnum.EQ,
          binary: '|',
        };
      case '^=':
        return {
          operator: AssignmentStatementOperatorEnum.EQ,
          binary: '^',
        };
      case '>>>=':
        return {
          operator: AssignmentStatementOperatorEnum.EQ,
          binary: '>>>',
        };
      case '>>=':
        return {
          operator: AssignmentStatementOperatorEnum.EQ,
          binary: '>>',
        };
      case '<<=':
        return {
          operator: AssignmentStatementOperatorEnum.EQ,
          binary: '<<',
        };
    }
    return {};
  };
};
