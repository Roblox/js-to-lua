import { createHandler, HandlerFunction } from '../../types';
import {
  callExpression,
  expressionStatement,
  functionExpression,
  isExpression,
  LuaExpression,
  LuaNodeGroup,
  LuaStatement,
  nodeGroup,
  returnStatement,
} from '@js-to-lua/lua-types';
import { Expression, SequenceExpression } from '@babel/types';
import { dropLast, takeLast } from 'ramda';
import { getReturnExpressions } from '../../utils/get-return-expressions';

export const createSequenceExpressionHandler = (
  expressionHandlerAsStatementFunction: HandlerFunction<
    LuaExpression | LuaStatement,
    Expression
  >
) =>
  createHandler<LuaExpression, SequenceExpression>(
    'SequenceExpression',
    (source, config, node) => {
      const handleExpression = expressionHandlerAsStatementFunction(
        source,
        config
      );
      const expressions = node.expressions.map(handleExpression);
      return callExpression(
        functionExpression(
          [],
          [
            ...dropLast(1, expressions).map((e) =>
              isExpression(e) ? expressionStatement(e) : e
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
  >
) =>
  createHandler<LuaNodeGroup, SequenceExpression>(
    'SequenceExpression',
    (source, config, node) => {
      const handleExpressionAsStatement = expressionHandlerAsStatementFunction(
        source,
        config
      );
      const expressions = node.expressions.map(handleExpressionAsStatement);
      return nodeGroup([...expressions]);
    }
  );
