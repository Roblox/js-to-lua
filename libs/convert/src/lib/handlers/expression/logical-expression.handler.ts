import {
  Expression,
  isIdentifier as isBabelIdentifier,
  isMemberExpression as isBabelMemberExpression,
  LogicalExpression,
} from '@babel/types';
import {
  AsStatementHandlerFunction,
  AsStatementReturnType,
  asStatementReturnTypeInline,
  asStatementReturnTypeStandaloneOrInline,
  createAsStatementHandler,
  createHandler,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToExpression,
  asStatementReturnTypeToReturn,
  asStatementReturnTypeToStatement,
  booleanInferableExpression,
  booleanMethod,
  defaultExpressionAsStatementHandler,
  generateUniqueIdentifier,
  isBooleanInferable,
  unwrapNestedNodeGroups,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  callExpression,
  elseExpressionClause,
  identifier,
  ifClause,
  ifElseExpression,
  ifExpressionClause,
  ifStatement,
  logicalExpression,
  LuaExpression,
  LuaLogicalExpression,
  LuaLogicalExpressionOperatorEnum,
  LuaStatement,
  nilLiteral,
  nodeGroup,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { applyTo, pipe } from 'ramda';

export const createLogicalExpressionHandler = (
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Expression
  >
) =>
  createHandler<LuaExpression, LogicalExpression>(
    'LogicalExpression',
    (source, config, node) => {
      const handleLogicalExpressionAsStatement =
        createLogicalExpressionAsStatementHandler(
          handleExpressionAsStatement
        ).handler;
      const result = handleLogicalExpressionAsStatement(source, config, node);
      return asStatementReturnTypeToExpression(result);
    }
  );

export const createLogicalExpressionAsStatementHandler = (
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Expression
  >
) =>
  createAsStatementHandler<LuaStatement, LogicalExpression>(
    'LogicalExpression',
    (source, config, node): AsStatementReturnType => {
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

      switch (node.operator) {
        case '||': {
          const isLeftExpressionBooleanInferable =
            isBooleanInferable(leftExpression);
          const isRightExpressionBooleanInferable =
            isBooleanInferable(rightExpression);

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
                  asStatementReturnTypeInline(
                    leftExpressionReturn.preStatements,
                    expression,
                    leftExpressionReturn.postStatements
                  )
              )
            );
          }

          return isBabelIdentifier(node.left) ||
            isBabelMemberExpression(node.left)
            ? asStatementReturnTypeInline(
                leftExpressionReturn.preStatements,
                logicalExpression(
                  LuaLogicalExpressionOperatorEnum.OR,
                  logicalExpression(
                    LuaLogicalExpressionOperatorEnum.AND,
                    callExpression(booleanMethod('toJSBoolean'), [
                      leftExpression,
                    ]),
                    leftExpression
                  ),
                  rightExpression
                ),
                leftExpressionReturn.postStatements
              )
            : applyTo(
                identifier(generateUniqueIdentifier([], 'ref')),
                (refId) =>
                  asStatementReturnTypeInline(
                    [
                      ...leftExpressionReturn.preStatements,
                      variableDeclaration(
                        [variableDeclaratorIdentifier(refId)],
                        [variableDeclaratorValue(leftExpression)]
                      ),
                    ],
                    logicalExpression(
                      LuaLogicalExpressionOperatorEnum.OR,
                      logicalExpression(
                        LuaLogicalExpressionOperatorEnum.AND,
                        callExpression(booleanMethod('toJSBoolean'), [refId]),
                        refId
                      ),
                      rightExpression
                    ),
                    leftExpressionReturn.postStatements
                  )
              );
        }
        case '&&': {
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
          return isBabelIdentifier(node.left) ||
            isBabelMemberExpression(node.left)
            ? asStatementReturnTypeStandaloneOrInline(
                leftExpressionReturn.preStatements,
                leftExpressionReturn.postStatements,
                ifStatement(
                  ifClause(
                    callExpression(booleanMethod('toJSBoolean'), [
                      leftExpression,
                    ]),
                    rightExpressionAsStatement
                  )
                ),
                ifElseExpression(
                  ifExpressionClause(
                    callExpression(booleanMethod('toJSBoolean'), [
                      leftExpression,
                    ]),
                    rightExpression
                  ),
                  elseExpressionClause(leftExpression)
                )
              )
            : applyTo(
                identifier(generateUniqueIdentifier([], 'ref')),
                (refId) =>
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
        }
        case '??': {
          return isBabelIdentifier(node.left) ||
            isBabelMemberExpression(node.left)
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
            : applyTo(
                identifier(generateUniqueIdentifier([], 'ref')),
                (refId) =>
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
        }
        default:
          return defaultExpressionAsStatementHandler(source, config, node);
      }
    }
  );
