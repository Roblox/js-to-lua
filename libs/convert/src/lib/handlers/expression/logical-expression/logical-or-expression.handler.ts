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
  identifier,
  ifClause,
  ifStatement,
  logicalExpression,
  LuaLogicalExpression,
  LuaLogicalExpressionOperatorEnum,
  LuaStatement,
  nodeGroup,
  unaryNegationExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { applyTo, pipe } from 'ramda';

export const createLogicalOrExpressionAsStatementHandlerFunction = (
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Babel.Expression
  >
) =>
  createAsStatementHandlerFunction<
    LuaStatement,
    Babel.LogicalExpression & { operator: '||' }
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
            LuaLogicalExpressionOperatorEnum.OR,
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
                  ifClause(
                    unaryNegationExpression(leftExpression),
                    rightExpressionAsStatement
                  )
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
                unaryNegationExpression(
                  callExpression(booleanMethod('toJSBoolean'), [leftExpression])
                ),
                rightExpressionAsStatement
              )
            ),
            logicalExpression(
              LuaLogicalExpressionOperatorEnum.OR,
              logicalExpression(
                LuaLogicalExpressionOperatorEnum.AND,
                callExpression(booleanMethod('toJSBoolean'), [leftExpression]),
                leftExpression
              ),
              rightExpression
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
                  unaryNegationExpression(
                    callExpression(booleanMethod('toJSBoolean'), [refId])
                  ),
                  rightExpressionAsStatement
                )
              ),
              logicalExpression(
                LuaLogicalExpressionOperatorEnum.OR,
                logicalExpression(
                  LuaLogicalExpressionOperatorEnum.AND,
                  callExpression(booleanMethod('toJSBoolean'), [refId]),
                  refId
                ),
                rightExpression
              )
            )
          );
    },
    { skipComments: true }
  );
