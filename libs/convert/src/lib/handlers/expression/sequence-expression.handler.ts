import {
  Expression,
  isUpdateExpression,
  SequenceExpression,
  UpdateExpression,
} from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  createExpressionStatement,
  getReturnExpressions,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  functionExpression,
  isExpression,
  LuaExpression,
  LuaNodeGroup,
  LuaStatement,
  nodeGroup,
  returnStatement,
} from '@js-to-lua/lua-types';
import { dropLast, last, takeLast } from 'ramda';

export const createSequenceExpressionHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  expressionHandlerAsStatementFunction: HandlerFunction<
    LuaExpression | LuaStatement,
    Expression
  >,
  updateExpressionHandlerAsStatementFunction: HandlerFunction<
    LuaStatement,
    UpdateExpression
  >
) =>
  createHandler<LuaExpression, SequenceExpression>(
    'SequenceExpression',
    (source, config, node) => {
      const handleExpression = expressionHandlerFunction(source, config);
      const handleExpressionAsStatement = expressionHandlerAsStatementFunction(
        source,
        config
      );
      const handleUpdateExpressionAsStatement =
        updateExpressionHandlerAsStatementFunction(source, config);

      const lastExpression = last(node.expressions);

      const expressions = [
        ...node.expressions
          .filter((n) => n !== lastExpression)
          .map((exp) =>
            isUpdateExpression(exp)
              ? handleUpdateExpressionAsStatement(exp)
              : handleExpressionAsStatement(exp)
          ),
        ...(lastExpression ? [handleExpression(lastExpression)] : []),
      ];

      return callExpression(
        functionExpression(
          [],
          nodeGroup([
            ...dropLast(1, expressions).map((e, index) =>
              isExpression(e)
                ? createExpressionStatement(source, node.expressions[index], e)
                : e
            ),
            ...takeLast(1, expressions).map((expression) =>
              returnStatement(...getReturnExpressions(expression))
            ),
          ])
        ),
        []
      );
    }
  );

export const createSequenceExpressionAsStatementHandler = (
  expressionHandlerAsStatementFunction: HandlerFunction<
    LuaExpression | LuaStatement,
    Expression
  >,
  updateExpressionHandlerAsStatementFunction: HandlerFunction<
    LuaStatement,
    UpdateExpression
  >
) =>
  createHandler<LuaNodeGroup, SequenceExpression>(
    'SequenceExpression',
    (source, config, node) => {
      const handleExpressionAsStatement = expressionHandlerAsStatementFunction(
        source,
        config
      );
      const handleUpdateExpressionAsStatement =
        updateExpressionHandlerAsStatementFunction(source, config);

      const lastExpression = last(node.expressions);

      const expressions = [
        ...node.expressions
          .filter((n) => n !== lastExpression)
          .map((exp) =>
            isUpdateExpression(exp)
              ? handleUpdateExpressionAsStatement(exp)
              : handleExpressionAsStatement(exp)
          ),
        ...(lastExpression
          ? [handleExpressionAsStatement(lastExpression)]
          : []),
      ];
      return nodeGroup([...expressions]);
    }
  );
