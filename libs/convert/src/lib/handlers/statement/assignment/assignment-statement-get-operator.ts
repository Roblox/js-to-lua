import {
  AssignmentExpression,
  BinaryExpression,
  Expression,
} from '@babel/types';
import { EmptyConfig, HandlerFunction } from '@js-to-lua/handler-utils';
import { isStringInferable } from '@js-to-lua/lua-conversion-utils';
import {
  AssignmentStatementOperatorEnum,
  LuaExpression,
} from '@js-to-lua/lua-types';

export const createGetAssignmentStatementOperator = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  return (
    source: string,
    config: EmptyConfig,
    node: AssignmentExpression
  ): {
    operator?: AssignmentStatementOperatorEnum;
    binary?: BinaryExpression['operator'];
  } => {
    const rightExpression = handleExpression(source, config, node.right);
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
