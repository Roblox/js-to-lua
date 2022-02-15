import {
  Expression,
  Statement,
  WhileStatement as BabelWhileStatement,
} from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  LuaExpression,
  LuaStatement,
  whileStatement,
  WhileStatement,
} from '@js-to-lua/lua-types';
import { createExpressionAsBooleanHandler } from '../handle-as-boolean';
import { createInnerBodyStatementHandler } from '../inner-statement-body-handler';

export const createWhileStatementHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleStatement: HandlerFunction<LuaStatement, Statement>
): BaseNodeHandler<WhileStatement, BabelWhileStatement> => {
  const bodyStatementHandler = createInnerBodyStatementHandler(handleStatement);
  const expressionAsBooleanHandler =
    createExpressionAsBooleanHandler(handleExpression);
  return createHandler('WhileStatement', (source, config, node) => {
    return whileStatement(
      expressionAsBooleanHandler(source, config, node.test),
      [bodyStatementHandler(source, config, node.body)]
    );
  });
};
