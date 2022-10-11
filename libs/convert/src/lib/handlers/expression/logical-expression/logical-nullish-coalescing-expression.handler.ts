import * as Babel from '@babel/types';
import {
  AsStatementHandlerFunction,
  asStatementReturnTypeInline,
  createAsStatementHandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToExpression,
  asStatementReturnTypeToReturn,
  generateUniqueIdentifier,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  elseExpressionClause,
  identifier,
  ifElseExpression,
  ifExpressionClause,
  LuaStatement,
  nilLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { applyTo } from 'ramda';

export const createLogicalNullishCoalescingExpressionAsStatementHandlerFunction =
  (
    handleExpressionAsStatement: AsStatementHandlerFunction<
      LuaStatement,
      Babel.Expression
    >
  ) =>
    createAsStatementHandlerFunction<
      LuaStatement,
      Babel.LogicalExpression & { operator: '??' }
    >(
      (source, config, node) => {
        const leftAsStatementResult = handleExpressionAsStatement(
          source,
          config,
          node.left
        );
        const rightAsStatementResult = handleExpressionAsStatement(
          source,
          config,
          node.right
        );

        const leftExpressionReturn = asStatementReturnTypeToReturn(
          leftAsStatementResult
        );
        const leftExpression = leftExpressionReturn.toReturn;
        const rightExpression = asStatementReturnTypeToExpression(
          rightAsStatementResult
        );

        return Babel.isIdentifier(node.left) ||
          Babel.isMemberExpression(node.left)
          ? asStatementReturnTypeInline(
              leftExpressionReturn.preStatements,
              ifElseExpression(
                ifExpressionClause(
                  binaryExpression(leftExpression, '~=', nilLiteral()),
                  leftExpression
                ),
                elseExpressionClause(rightExpression)
              ),
              leftExpressionReturn.postStatements
            )
          : applyTo(identifier(generateUniqueIdentifier([], 'ref')), (refId) =>
              asStatementReturnTypeInline(
                [
                  ...leftExpressionReturn.preStatements,
                  variableDeclaration(
                    [variableDeclaratorIdentifier(refId)],
                    [variableDeclaratorValue(leftExpression)]
                  ),
                ],
                ifElseExpression(
                  ifExpressionClause(
                    binaryExpression(refId, '~=', nilLiteral()),
                    refId
                  ),
                  elseExpressionClause(rightExpression)
                ),
                leftExpressionReturn.postStatements
              )
            );
      },
      { skipComments: true }
    );
