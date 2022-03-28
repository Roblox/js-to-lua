import {
  DoWhileStatement as BabelDoWhileStatement,
  Expression,
  Statement,
} from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  LuaExpression,
  LuaStatement,
  RepeatStatement,
  repeatStatement,
  unaryNegationExpression,
} from '@js-to-lua/lua-types';
import { createExpressionAsBooleanHandler } from '../handle-as-boolean';
import { createInnerBodyStatementHandler } from '../inner-statement-body-handler';

export const createDoWhileStatementHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleStatement: HandlerFunction<LuaStatement, Statement>
): BaseNodeHandler<RepeatStatement, BabelDoWhileStatement> => {
  const bodyStatementHandler = createInnerBodyStatementHandler(handleStatement);
  const expressionAsBooleanHandler =
    createExpressionAsBooleanHandler(handleExpression);
  return createHandler('DoWhileStatement', (source, config, node) => {
    return repeatStatement(
      unaryNegationExpression(
        expressionAsBooleanHandler(source, config, node.test)
      ),
      [bodyStatementHandler(source, config, node.body)]
    );
  });
};
