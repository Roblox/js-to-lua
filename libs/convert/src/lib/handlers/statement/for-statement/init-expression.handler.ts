import * as Babel from '@babel/types';
import {
  AsStatementHandlerFunction,
  BaseNodeHandler,
  combineHandlers,
  createHandler,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToStatement,
  defaultStatementHandler,
} from '@js-to-lua/lua-conversion-utils';
import { LuaExpression, LuaStatement } from '@js-to-lua/lua-types';

export const createInitExpressionHandler = (
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Babel.Expression
  >,
  expressionHandler: BaseNodeHandler<LuaExpression, Babel.Expression>
) => {
  return combineHandlers(
    [
      createHandler<LuaStatement, Babel.Expression>(
        expressionHandler.type,
        (source, config, expression) =>
          asStatementReturnTypeToStatement(
            source,
            expression,
            handleExpressionAsStatement(source, config, expression)
          )
      ),
    ],
    defaultStatementHandler
  ).handler;
};
