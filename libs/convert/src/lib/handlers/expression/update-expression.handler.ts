import { Expression, UpdateExpression } from '@babel/types';
import {
  asStatementReturnTypeWithIdentifier,
  BaseNodeAsStatementHandler,
  createAsStatementHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { asStatementReturnTypeToExpression } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  LuaExpression,
  LuaLVal,
  LuaStatement,
  numericLiteral,
} from '@js-to-lua/lua-types';
import { NonEmptyArray } from '@js-to-lua/shared-utils';

export const createUpdateExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  return createHandler<LuaExpression, UpdateExpression>(
    'UpdateExpression',
    (source, config, node) => {
      const handleUpdateExpressionAsStatement =
        createUpdateExpressionAsStatementHandler(handleExpression).handler;
      const result = handleUpdateExpressionAsStatement(source, config, node);
      return asStatementReturnTypeToExpression(result);
    }
  );
};

export const createUpdateExpressionAsStatementHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
): BaseNodeAsStatementHandler<LuaStatement, UpdateExpression> => {
  return createAsStatementHandler<LuaStatement, UpdateExpression>(
    'UpdateExpression',
    (source, config, node) => {
      const updateStatement = assignmentStatement(
        node.operator === '++'
          ? AssignmentStatementOperatorEnum.ADD
          : AssignmentStatementOperatorEnum.SUB,
        [handleExpression(source, config, node.argument)],
        [numericLiteral(1)]
      );

      const [preStatements, postStatements]: [LuaStatement[], LuaStatement[]] =
        node.prefix ? [[updateStatement], []] : [[], [updateStatement]];

      return asStatementReturnTypeWithIdentifier(
        preStatements,
        postStatements,
        ...(updateStatement.identifiers as NonEmptyArray<LuaLVal>)
      ); // TODO: check in non empty array
    }
  );
};
