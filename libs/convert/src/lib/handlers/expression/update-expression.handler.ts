import * as Babel from '@babel/types';
import {
  asStatementReturnTypeWithIdentifier,
  BaseNodeAsStatementHandler,
  createAsStatementHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToExpression,
  defaultExpressionAsStatementHandler,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  isLuaLVal,
  LuaExpression,
  LuaStatement,
  numericLiteral,
} from '@js-to-lua/lua-types';

export const createUpdateExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>
) => {
  return createHandler<LuaExpression, Babel.UpdateExpression>(
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
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>
): BaseNodeAsStatementHandler<LuaStatement, Babel.UpdateExpression> => {
  return createAsStatementHandler<LuaStatement, Babel.UpdateExpression>(
    'UpdateExpression',
    (source, config, node) => {
      const updateExpressionIdentifier = handleExpression(
        source,
        config,
        node.argument
      );

      if (!isLuaLVal(updateExpressionIdentifier)) {
        return defaultExpressionAsStatementHandler(source, config, node);
      }

      const updateStatement = assignmentStatement(
        node.operator === '++'
          ? AssignmentStatementOperatorEnum.ADD
          : AssignmentStatementOperatorEnum.SUB,
        [updateExpressionIdentifier],
        [numericLiteral(1)]
      );

      const [preStatements, postStatements]: [LuaStatement[], LuaStatement[]] =
        node.prefix ? [[updateStatement], []] : [[], [updateStatement]];

      return asStatementReturnTypeWithIdentifier(
        preStatements,
        postStatements,
        updateExpressionIdentifier
      );
    }
  );
};
