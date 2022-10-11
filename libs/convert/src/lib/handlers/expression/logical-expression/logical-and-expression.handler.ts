import * as Babel from '@babel/types';
import {
  AsStatementHandlerFunction,
  asStatementReturnTypeStandaloneOrInline,
  createAsStatementHandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToExpression,
  asStatementReturnTypeToReturn,
  asStatementReturnTypeToStatement,
  booleanInferableExpression,
  booleanMethod,
  generateUniqueIdentifier,
  isBooleanInferable,
  unwrapNestedNodeGroups,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  elseExpressionClause,
  identifier,
  ifClause,
  ifElseExpression,
  ifExpressionClause,
  ifStatement,
  logicalExpression,
  LuaLogicalExpression,
  LuaLogicalExpressionOperatorEnum,
  LuaStatement,
  nodeGroup,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { applyTo, pipe } from 'ramda';

export const createLogicalAndExpressionAsStatementHandlerFunction = (
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Babel.Expression
  >
) =>
  createAsStatementHandlerFunction<
    LuaStatement,
    Babel.LogicalExpression & { operator: '&&' }
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

      const isLeftExpressionBooleanInferable =
        isBooleanInferable(leftExpression);
      const isRightExpressionBooleanInferable =
        isBooleanInferable(rightExpression);

      const rightExpressionAsStatement = unwrapNestedNodeGroups(
        nodeGroup([
          asStatementReturnTypeToStatement(
            source,
            node.right,
            rightAsStatementResult
          ),
        ])
      );
      if (isLeftExpressionBooleanInferable) {
        return applyTo(
          logicalExpression(
            LuaLogicalExpressionOperatorEnum.AND,
            leftExpression,
            rightExpression
          ),
          pipe(
            (expression: LuaLogicalExpression) =>
              isRightExpressionBooleanInferable
                ? booleanInferableExpression(expression)
                : expression,
            (expression) =>
              asStatementReturnTypeStandaloneOrInline(
                leftExpressionReturn.preStatements,
                leftExpressionReturn.postStatements,
                ifStatement(
                  ifClause(leftExpression, rightExpressionAsStatement)
                ),
                expression
              )
          )
        );
      }
      return Babel.isIdentifier(node.left) ||
        Babel.isMemberExpression(node.left)
        ? asStatementReturnTypeStandaloneOrInline(
            leftExpressionReturn.preStatements,
            leftExpressionReturn.postStatements,
            ifStatement(
              ifClause(
                callExpression(booleanMethod('toJSBoolean'), [leftExpression]),
                rightExpressionAsStatement
              )
            ),
            ifElseExpression(
              ifExpressionClause(
                callExpression(booleanMethod('toJSBoolean'), [leftExpression]),
                rightExpression
              ),
              elseExpressionClause(leftExpression)
            )
          )
        : applyTo(identifier(generateUniqueIdentifier([], 'ref')), (refId) =>
            asStatementReturnTypeStandaloneOrInline(
              [
                ...leftExpressionReturn.preStatements,
                variableDeclaration(
                  [variableDeclaratorIdentifier(refId)],
                  [variableDeclaratorValue(leftExpression)]
                ),
              ],
              leftExpressionReturn.postStatements,
              ifStatement(
                ifClause(
                  callExpression(booleanMethod('toJSBoolean'), [refId]),
                  rightExpressionAsStatement
                )
              ),
              ifElseExpression(
                ifExpressionClause(
                  callExpression(booleanMethod('toJSBoolean'), [refId]),
                  rightExpression
                ),
                elseExpressionClause(refId)
              )
            )
          );
    },
    { skipComments: true }
  );
