import { BaseNodeHandler, createHandler, HandlerFunction } from '../../types';
import { Expression, LogicalExpression } from '@babel/types';
import {
  booleanMethod,
  callExpression,
  elseClause,
  functionExpression,
  ifClause,
  ifStatement,
  logicalExpression,
  LuaCallExpression,
  LuaExpression,
  LuaLogicalExpression,
  LuaLogicalExpressionOperatorEnum,
  returnStatement,
  UnhandledStatement,
} from '@js-to-lua/lua-types';
import { defaultStatementHandler } from '../../utils/default-handlers';
import { isLuaTruthy } from '../../utils/is-lua-truthy';

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
        return logicalExpression(
          LuaLogicalExpressionOperatorEnum.OR,
          logicalExpression(
            LuaLogicalExpressionOperatorEnum.AND,
            callExpression(booleanMethod('toJSBoolean'), [leftExpression]),
            leftExpression
          ),
          rightExpression
        );
      }
      case '&&': {
        const isRightExpressionTruthy = isLuaTruthy(node.right);

        const leftExpression = handleExpression(source, config, node.left);
        const rightExpression = handleExpression(source, config, node.right);
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
                [
                  ifStatement(
                    ifClause(
                      callExpression(booleanMethod('toJSBoolean'), [
                        leftExpression,
                      ]),
                      [returnStatement(rightExpression)]
                    ),
                    [],
                    elseClause([returnStatement(leftExpression)])
                  ),
                ]
              ),
              []
            );
      }
      default:
        return defaultStatementHandler(source, config, node);
    }
  });
