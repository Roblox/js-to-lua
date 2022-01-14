import { createHandler, HandlerFunction } from '../../types';
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
import {
  Expression,
  isUpdateExpression,
  SequenceExpression,
  UpdateExpression,
} from '@babel/types';
import { dropLast, takeLast } from 'ramda';
import { getReturnExpressions } from '../../utils/get-return-expressions';
import { createExpressionStatement } from '../../utils/create-expression-statement';

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

      const last = node.expressions.pop();
      const expressions = [
        ...node.expressions.map((exp) =>
          isUpdateExpression(exp)
            ? handleUpdateExpressionAsStatement(exp)
            : handleExpressionAsStatement(exp)
        ),
        ...(last ? [handleExpression(last)] : []),
      ];

      return callExpression(
        functionExpression(
          [],
          [
            ...dropLast(1, expressions).map((e, index) =>
              isExpression(e)
                ? createExpressionStatement(source, node.expressions[index], e)
                : e
            ),
            ...takeLast(1, expressions).map((expression) =>
              returnStatement(...getReturnExpressions(expression))
            ),
          ]
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

      const last = node.expressions.pop();
      const expressions = [
        ...node.expressions.map((exp) =>
          isUpdateExpression(exp)
            ? handleUpdateExpressionAsStatement(exp)
            : handleExpressionAsStatement(exp)
        ),
        ...(last ? [handleExpressionAsStatement(last)] : []),
      ];
      return nodeGroup([...expressions]);
    }
  );
