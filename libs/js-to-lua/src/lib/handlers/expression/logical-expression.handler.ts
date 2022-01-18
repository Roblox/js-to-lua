import { BaseNodeHandler, createHandler, HandlerFunction } from '../../types';
import {
  Expression,
  isIdentifier as isBabelIdentifier,
  isMemberExpression as isBabelMemberExpression,
  LogicalExpression,
} from '@babel/types';
import {
  booleanInferableExpression,
  booleanMethod,
  callExpression,
  elseClause,
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
  isBooleanInferable,
  logicalExpression,
  LuaCallExpression,
  LuaExpression,
  LuaLogicalExpression,
  LuaLogicalExpressionOperatorEnum,
  nodeGroup,
  returnStatement,
  UnhandledStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { defaultStatementHandler } from '../../utils/default-handlers';
import { isLuaTruthy } from '../../utils/is-lua-truthy';
import { applyTo } from 'ramda';

export const createLogicalExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
): BaseNodeHandler<
  LuaLogicalExpression | LuaCallExpression | UnhandledStatement,
  LogicalExpression
> =>
  createHandler('LogicalExpression', (source, config, node) => {
    switch (node.operator) {
      case '||': {
        const leftExpression = handleExpression(source, config, node.left);
        const rightExpression = handleExpression(source, config, node.right);

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
            (expression) =>
              isRightExpressionBooleanInferable
                ? booleanInferableExpression(expression)
                : expression
          );
        }

        return logicalExpression(
          LuaLogicalExpressionOperatorEnum.OR,
          isBabelIdentifier(node.left) || isBabelMemberExpression(node.left)
            ? logicalExpression(
                LuaLogicalExpressionOperatorEnum.AND,
                callExpression(booleanMethod('toJSBoolean'), [leftExpression]),
                leftExpression
              )
            : callExpression(
                functionExpression(
                  [],
                  nodeGroup([
                    variableDeclaration(
                      [variableDeclaratorIdentifier(identifier('ref'))],
                      [variableDeclaratorValue(leftExpression)]
                    ),
                    returnStatement(
                      logicalExpression(
                        LuaLogicalExpressionOperatorEnum.AND,
                        callExpression(booleanMethod('toJSBoolean'), [
                          identifier('ref'),
                        ]),
                        identifier('ref')
                      )
                    ),
                  ])
                ),
                []
              ),
          rightExpression
        );
      }
      case '&&': {
        const isRightExpressionTruthy = isLuaTruthy(node.right);

        const leftExpression = handleExpression(source, config, node.left);
        const rightExpression = handleExpression(source, config, node.right);

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
            (expression) =>
              isRightExpressionBooleanInferable
                ? booleanInferableExpression(expression)
                : expression
          );
        }
        return isRightExpressionTruthy
          ? logicalExpression(
              LuaLogicalExpressionOperatorEnum.OR,
              logicalExpression(
                LuaLogicalExpressionOperatorEnum.AND,
                callExpression(booleanMethod('toJSBoolean'), [leftExpression]),
                rightExpression
              ),
              leftExpression
            )
          : callExpression(
              functionExpression(
                [],
                isBabelIdentifier(node.left) ||
                  isBabelMemberExpression(node.left)
                  ? nodeGroup([
                      ifStatement(
                        ifClause(
                          callExpression(booleanMethod('toJSBoolean'), [
                            leftExpression,
                          ]),
                          nodeGroup([returnStatement(rightExpression)])
                        ),
                        [],
                        elseClause(nodeGroup([returnStatement(leftExpression)]))
                      ),
                    ])
                  : nodeGroup([
                      variableDeclaration(
                        [variableDeclaratorIdentifier(identifier('ref'))],
                        [variableDeclaratorValue(leftExpression)]
                      ),
                      ifStatement(
                        ifClause(
                          callExpression(booleanMethod('toJSBoolean'), [
                            identifier('ref'),
                          ]),
                          nodeGroup([returnStatement(rightExpression)])
                        ),
                        [],
                        elseClause(
                          nodeGroup([returnStatement(identifier('ref'))])
                        )
                      ),
                    ])
              ),
              []
            );
      }
      default:
        return defaultStatementHandler(source, config, node);
    }
  });
