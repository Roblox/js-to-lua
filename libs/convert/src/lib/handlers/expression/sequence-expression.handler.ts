import { Expression, SequenceExpression } from '@babel/types';
import {
  AsStatementHandlerFunction,
  createHandler,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToReturnStatement,
  asStatementReturnTypeToStatement,
  unwrapStatements,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  functionExpression,
  LuaExpression,
  LuaStatement,
  nodeGroup,
} from '@js-to-lua/lua-types';
import { dropLast, takeLast } from 'ramda';

export const createSequenceExpressionHandler = (
  expressionHandlerAsStatementFunction: AsStatementHandlerFunction<
    LuaStatement,
    Expression
  >
) =>
  createHandler<LuaExpression, SequenceExpression>(
    'SequenceExpression',
    (source, config, node) => {
      const handleExpressionAsStatement = expressionHandlerAsStatementFunction(
        source,
        config
      );

      const expressions = [
        ...node.expressions.map((e) => ({
          babelExpression: e,
          luaExpressionAsStatement: handleExpressionAsStatement(e),
        })),
      ];

      return callExpression(
        functionExpression(
          [],
          nodeGroup([
            ...dropLast(1, expressions)
              .map(({ babelExpression, luaExpressionAsStatement }) =>
                asStatementReturnTypeToStatement(
                  source,
                  babelExpression,
                  luaExpressionAsStatement
                )
              )
              .map(unwrapStatements)
              .flat(),
            ...takeLast(1, expressions)
              .map(({ luaExpressionAsStatement }) =>
                asStatementReturnTypeToReturnStatement(luaExpressionAsStatement)
              )
              .flat(),
          ])
        ),
        []
      );
    }
  );
