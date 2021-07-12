import { BaseNodeHandler, createHandler, HandlerFunction } from '../../types';
import {
  callExpression,
  elseClause,
  functionExpression,
  ifClause,
  ifStatement,
  logicalExpression,
  LuaExpression,
  LuaLogicalExpressionOperatorEnum,
  returnStatement,
} from '@js-to-lua/lua-types';
import { ConditionalExpression, Expression } from '@babel/types';
import { createExpressionAsBooleanHandler } from '../handle-as-boolean';
import { isLuaTruthy } from '../../utils/is-lua-truthy';

export const createConditionalExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
): BaseNodeHandler<LuaExpression, ConditionalExpression> =>
  createHandler('ConditionalExpression', (source, config, node) => {
    const handleAsBoolean = createExpressionAsBooleanHandler(handleExpression);

    const testExpression = handleAsBoolean(source, config, node.test);
    const consequentExpression = handleExpression(
      source,
      config,
      node.consequent
    );
    const alternateExpression = handleExpression(
      source,
      config,
      node.alternate
    );
    return isLuaTruthy(node.consequent)
      ? logicalExpression(
          LuaLogicalExpressionOperatorEnum.OR,
          logicalExpression(
            LuaLogicalExpressionOperatorEnum.AND,
            testExpression,
            consequentExpression
          ),
          alternateExpression
        )
      : callExpression(
          functionExpression(
            [],
            [
              ifStatement(
                ifClause(testExpression, [
                  returnStatement(consequentExpression),
                ]),
                [],
                elseClause([returnStatement(alternateExpression)])
              ),
            ]
          ),
          []
        );
  });
