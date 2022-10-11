import * as Babel from '@babel/types';
import {
  AsStatementHandlerFunction,
  AsStatementReturnType,
  createAsStatementHandler,
  createHandler,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToExpression,
  defaultExpressionAsStatementHandler,
} from '@js-to-lua/lua-conversion-utils';
import { LuaExpression, LuaStatement } from '@js-to-lua/lua-types';
import { createLogicalAndExpressionAsStatementHandlerFunction } from './logical-and-expression.handler';
import { createLogicalNullishCoalescingExpressionAsStatementHandlerFunction } from './logical-nullish-coalescing-expression.handler';
import { createLogicalOrExpressionAsStatementHandlerFunction } from './logical-or-expression.handler';

export const createLogicalExpressionHandler = (
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Babel.Expression
  >
) =>
  createHandler<LuaExpression, Babel.LogicalExpression>(
    'LogicalExpression',
    (source, config, node) => {
      const handleLogicalExpressionAsStatement =
        createLogicalExpressionAsStatementHandler(
          handleExpressionAsStatement
        ).handler;
      const result = handleLogicalExpressionAsStatement(source, config, node);
      return asStatementReturnTypeToExpression(result);
    }
  );

export const createLogicalExpressionAsStatementHandler = (
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Babel.Expression
  >
) =>
  createAsStatementHandler<LuaStatement, Babel.LogicalExpression>(
    'LogicalExpression',
    (source, config, node): AsStatementReturnType => {
      const logicalOrExpressionAsStatementHandlerFunction =
        createLogicalOrExpressionAsStatementHandlerFunction(
          handleExpressionAsStatement
        )(source, config);
      const logicalAndExpressionAsStatementHandlerFunction =
        createLogicalAndExpressionAsStatementHandlerFunction(
          handleExpressionAsStatement
        )(source, config);
      const logicalNullishCoalescingExpressionAsStatementHandlerFunction =
        createLogicalNullishCoalescingExpressionAsStatementHandlerFunction(
          handleExpressionAsStatement
        )(source, config);
      switch (node.operator) {
        case '||': {
          return logicalOrExpressionAsStatementHandlerFunction({
            ...node,
            operator: node.operator,
          });
        }
        case '&&': {
          return logicalAndExpressionAsStatementHandlerFunction({
            ...node,
            operator: node.operator,
          });
        }
        case '??': {
          return logicalNullishCoalescingExpressionAsStatementHandlerFunction({
            ...node,
            operator: node.operator,
          });
        }
        default:
          return defaultExpressionAsStatementHandler(source, config, node);
      }
    }
  );
