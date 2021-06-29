import { BaseNodeHandler, createHandler, HandlerFunction } from '../types';
import { Expression, LogicalExpression } from '@babel/types';
import {
  booleanMethod,
  callExpression,
  functionExpression,
  ifStatement,
  logicalExpression,
  LuaCallExpression,
  LuaExpression,
  LuaLogicalExpression,
  LuaLogicalExpressionOperatorEnum,
  returnStatement,
  UnhandledStatement,
} from '@js-to-lua/lua-types';
import { defaultStatementHandler } from '../utils/default-handlers';

export const createLogicalExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
): BaseNodeHandler<
  LuaLogicalExpression | LuaCallExpression | UnhandledStatement,
  LogicalExpression
> =>
  createHandler('LogicalExpression', (source, node) => {
    switch (node.operator) {
      case '||': {
        const leftExpression = handleExpression(source, node.left);
        const rightExpression = handleExpression(source, node.right);
        return logicalExpression(
          LuaLogicalExpressionOperatorEnum.AND,
          callExpression(booleanMethod('toJSBoolean'), [leftExpression]),
          logicalExpression(
            LuaLogicalExpressionOperatorEnum.OR,
            leftExpression,
            rightExpression
          )
        );
      }
      case '&&': {
        const isLuaTruthy = (expression: Expression): boolean => {
          const isTruthyPredicates = [
            (e: Expression): boolean => e.type === 'NumericLiteral',
            (e: Expression): boolean => e.type === 'StringLiteral',
            (e: Expression): boolean => e.type === 'BooleanLiteral' && e.value,
            (e: Expression): boolean => e.type === 'ObjectExpression',
            (e: Expression): boolean => e.type === 'ArrayExpression',
            (e: Expression): boolean =>
              e.type === 'Identifier' && e.name === 'NaN',
          ];

          return isTruthyPredicates.some((predicate) => predicate(expression));
        };

        const isRightExpressionTruthy = isLuaTruthy(node.right);

        const leftExpression = handleExpression(source, node.left);
        const rightExpression = handleExpression(source, node.right);
        return isRightExpressionTruthy
          ? logicalExpression(
              LuaLogicalExpressionOperatorEnum.AND,
              callExpression(booleanMethod('toJSBoolean'), [leftExpression]),
              logicalExpression(
                LuaLogicalExpressionOperatorEnum.OR,
                rightExpression,
                leftExpression
              )
            )
          : callExpression(
              functionExpression(
                [],
                [
                  ifStatement(
                    callExpression(booleanMethod('toJSBoolean'), [
                      leftExpression,
                    ]),
                    [returnStatement(rightExpression)],
                    [returnStatement(leftExpression)]
                  ),
                ]
              ),
              []
            );
      }
      default:
        return defaultStatementHandler(source, node);
    }
  });
