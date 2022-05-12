import { Expression, ReturnStatement } from '@babel/types';
import {
  AsStatementHandlerFunction,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToReturnStatement,
  unwrapStatement,
} from '@js-to-lua/lua-conversion-utils';
import {
  LuaExpression,
  LuaStatement,
  nodeGroup,
  returnStatement,
} from '@js-to-lua/lua-types';

export const createReturnStatementHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Expression
  >
) =>
  createHandler<LuaStatement, ReturnStatement>(
    'ReturnStatement',
    (source, config, node) => {
      if (!node.argument) {
        return returnStatement();
      }

      const argumentExpression = handleExpressionAsStatement(
        source,
        config,
        node.argument
      );

      return unwrapStatement(
        nodeGroup(asStatementReturnTypeToReturnStatement(argumentExpression))
      );
    }
  );
