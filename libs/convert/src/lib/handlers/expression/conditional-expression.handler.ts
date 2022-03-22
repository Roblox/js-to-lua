import { ConditionalExpression, Expression } from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  elseExpressionClause,
  ifElseExpression,
  ifExpressionClause,
  LuaExpression,
} from '@js-to-lua/lua-types';
import { createExpressionAsBooleanHandler } from '../handle-as-boolean';

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
    return ifElseExpression(
      ifExpressionClause(testExpression, consequentExpression),
      elseExpressionClause(alternateExpression)
    );
  });
