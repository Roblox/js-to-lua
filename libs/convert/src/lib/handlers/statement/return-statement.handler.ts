import { Expression, ReturnStatement } from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { getReturnExpressions } from '@js-to-lua/lua-conversion-utils';
import {
  LuaExpression,
  LuaReturnStatement,
  LuaStatement,
  nodeGroup,
  returnStatement,
} from '@js-to-lua/lua-types';

export const createReturnStatementHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleExpressionAsStatement: HandlerFunction<
    LuaExpression | LuaStatement,
    Expression
  >
): BaseNodeHandler<LuaReturnStatement, ReturnStatement> =>
  createHandler('ReturnStatement', (source, config, node) => {
    if (!node.argument) {
      return returnStatement();
    }

    const argumentExpression = handleExpressionAsStatement(
      source,
      config,
      node.argument
    );
    const returnExpressions = getReturnExpressions(argumentExpression);
    if (returnExpressions[0] !== argumentExpression) {
      return nodeGroup([
        argumentExpression,
        returnStatement(...returnExpressions),
      ]);
    }
    return returnStatement(...returnExpressions);
  });
