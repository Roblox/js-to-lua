import {
  AssignmentExpression,
  Expression,
  ExpressionStatement,
} from '@babel/types';
import {
  AsStatementHandlerFunction,
  BaseNodeAsStatementHandler,
  BaseNodeHandler,
  combineAsStatementHandlers,
  createHandler,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToStatement,
  defaultExpressionAsStatementHandler,
  unwrapStatement,
} from '@js-to-lua/lua-conversion-utils';
import {
  AssignmentStatement,
  LuaExpression,
  LuaStatement,
  LuaTableConstructor,
  LuaTableKeyField,
} from '@js-to-lua/lua-types';
import { createExpressionAsStatementHandler } from '../expression/expression.handler';
import { NoSpreadObjectProperty } from '../expression/object-expression/object-expression.types';
import { createUpdateExpressionAsStatementHandler } from '../expression/update-expression.handler';

export const createExpressionStatementHandler = (
  handleExpression: BaseNodeHandler<LuaExpression, Expression>,
  handleAssignmentExpressionAsStatement: BaseNodeAsStatementHandler<
    AssignmentStatement,
    AssignmentExpression
  >,
  handleObjectFieldAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    NoSpreadObjectProperty,
    LuaTableConstructor<[LuaTableKeyField]>
  >
) => {
  const handleUpdateExpressionAsStatement =
    createUpdateExpressionAsStatementHandler(handleExpression.handler);
  const handleExpressionAsStatement = createExpressionAsStatementHandler(
    handleExpression,
    handleAssignmentExpressionAsStatement,
    handleObjectFieldAsStatement
  );

  return createHandler<LuaStatement, ExpressionStatement>(
    'ExpressionStatement',
    (source, config, statement) => {
      const { handler: handleExpressionStatementExpression } =
        combineAsStatementHandlers(
          [
            handleAssignmentExpressionAsStatement,
            handleUpdateExpressionAsStatement,
            handleExpressionAsStatement,
          ],
          defaultExpressionAsStatementHandler
        );

      return unwrapStatement(
        asStatementReturnTypeToStatement(
          source,
          statement.expression,
          handleExpressionStatementExpression(
            source,
            config,
            statement.expression
          )
        )
      );
    }
  );
};
