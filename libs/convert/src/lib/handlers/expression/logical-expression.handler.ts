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
  createAsStatementHandler,
  createHandler,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToExpression,
  asStatementReturnTypeToReturn,
  booleanInferableExpression,
  booleanMethod,
  defaultExpressionAsStatementHandler,
  isBooleanInferable,
  isLuaTruthy,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  callExpression,
  elseExpressionClause,
  identifier,
  ifElseExpression,
  ifExpressionClause,
  logicalExpression,
  LuaExpression,
  LuaLogicalExpression,
  LuaLogicalExpressionOperatorEnum,
  LuaStatement,
  nilLiteral,
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
      const leftExpression = leftExpressionReturn.toReturn[0];
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
            : asStatementReturnTypeInline(
                [
                  ...leftExpressionReturn.preStatements,
                  variableDeclaration(
                    [variableDeclaratorIdentifier(identifier('ref'))],
                    [variableDeclaratorValue(leftExpression)]
                  ),
                ],
                logicalExpression(
                  LuaLogicalExpressionOperatorEnum.OR,
                  logicalExpression(
                    LuaLogicalExpressionOperatorEnum.AND,
                    callExpression(booleanMethod('toJSBoolean'), [
                      identifier('ref'),
                    ]),
                    identifier('ref')
                  ),
                  rightExpression
                ),
                leftExpressionReturn.postStatements
              );
        }
        case '&&': {
          const isRightExpressionTruthy = isLuaTruthy(node.right);

          const isLeftExpressionBooleanInferable =
            isBooleanInferable(leftExpression);
          const isRightExpressionBooleanInferable =
            isBooleanInferable(rightExpression);

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
                  asStatementReturnTypeInline(
                    leftExpressionReturn.preStatements,
                    expression,
                    leftExpressionReturn.postStatements
                  )
              )
            );
          }
          return isRightExpressionTruthy
            ? isBabelIdentifier(node.left) || isBabelMemberExpression(node.left)
              ? asStatementReturnTypeInline(
                  leftExpressionReturn.preStatements,
                  logicalExpression(
                    LuaLogicalExpressionOperatorEnum.OR,
                    logicalExpression(
                      LuaLogicalExpressionOperatorEnum.AND,
                      callExpression(booleanMethod('toJSBoolean'), [
                        leftExpression,
                      ]),
                      rightExpression
                    ),
                    leftExpression
                  ),
                  leftExpressionReturn.postStatements
                )
              : asStatementReturnTypeInline(
                  [
                    ...leftExpressionReturn.preStatements,
                    variableDeclaration(
                      [variableDeclaratorIdentifier(identifier('ref'))],
                      [variableDeclaratorValue(leftExpression)]
                    ),
                  ],
                  logicalExpression(
                    LuaLogicalExpressionOperatorEnum.OR,
                    logicalExpression(
                      LuaLogicalExpressionOperatorEnum.AND,
                      callExpression(booleanMethod('toJSBoolean'), [
                        identifier('ref'),
                      ]),
                      rightExpression
                    ),
                    identifier('ref')
                  ),
                  leftExpressionReturn.postStatements
                )
            : isBabelIdentifier(node.left) || isBabelMemberExpression(node.left)
            ? asStatementReturnTypeInline(
                leftExpressionReturn.preStatements,
                ifElseExpression(
                  ifExpressionClause(
                    callExpression(booleanMethod('toJSBoolean'), [
                      leftExpression,
                    ]),
                    rightExpression
                  ),
                  elseExpressionClause(leftExpression)
                ),
                leftExpressionReturn.postStatements
              )
            : asStatementReturnTypeInline(
                [
                  ...leftExpressionReturn.preStatements,
                  variableDeclaration(
                    [variableDeclaratorIdentifier(identifier('ref'))],
                    [variableDeclaratorValue(leftExpression)]
                  ),
                ],
                ifElseExpression(
                  ifExpressionClause(
                    callExpression(booleanMethod('toJSBoolean'), [
                      identifier('ref'),
                    ]),
                    rightExpression
                  ),
                  elseExpressionClause(identifier('ref'))
                ),
                leftExpressionReturn.postStatements
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
            : asStatementReturnTypeInline(
                [
                  ...leftExpressionReturn.preStatements,
                  variableDeclaration(
                    [variableDeclaratorIdentifier(identifier('ref'))],
                    [variableDeclaratorValue(leftExpression)]
                  ),
                ],
                ifElseExpression(
                  ifExpressionClause(
                    binaryExpression(identifier('ref'), '~=', nilLiteral()),
                    identifier('ref')
                  ),
                  elseExpressionClause(rightExpression)
                ),
                leftExpressionReturn.postStatements
              );
        }
        default:
          return defaultExpressionAsStatementHandler(source, config, node);
      }
    }
  );
