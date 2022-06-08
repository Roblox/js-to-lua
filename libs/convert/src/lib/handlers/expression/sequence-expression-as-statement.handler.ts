import { Expression, SequenceExpression } from '@babel/types';
import {
  AsStatementHandlerFunction,
  asStatementReturnTypeInline,
  asStatementReturnTypeWithIdentifier,
  createAsStatementHandler,
  isAsStatementReturnTypeInline,
  isAsStatementReturnTypeWithIdentifier,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToReturn,
  createExpressionStatement,
  defaultExpressionAsStatementHandler,
} from '@js-to-lua/lua-conversion-utils';
import { LuaStatement } from '@js-to-lua/lua-types';
import { dropLast, last } from 'ramda';

export const createSequenceExpressionAsStatementHandler = (
  expressionHandlerAsStatementFunction: AsStatementHandlerFunction<
    LuaStatement,
    Expression
  >
) => {
  return createAsStatementHandler<LuaStatement, SequenceExpression>(
    'SequenceExpression',
    (source, config, node) => {
      const handleExpressionAsStatement = expressionHandlerAsStatementFunction(
        source,
        config
      );

      const lastExpression = last(node.expressions);

      const expressions = [
        ...node.expressions
          .filter((n) => n !== lastExpression)
          .map(handleExpressionAsStatement),
        ...(lastExpression
          ? [handleExpressionAsStatement(lastExpression)]
          : []),
      ];

      const preStatements = dropLast(1, expressions)
        .map((asStatementReturnType) =>
          isAsStatementReturnTypeInline(asStatementReturnType)
            ? [
                ...asStatementReturnType.preStatements,
                createExpressionStatement(
                  source,
                  node,
                  asStatementReturnType.inlineExpression
                ),
                ...asStatementReturnType.postStatements,
              ]
            : isAsStatementReturnTypeWithIdentifier(asStatementReturnType)
            ? [
                ...asStatementReturnType.preStatements,
                ...asStatementReturnType.postStatements,
              ]
            : [
                ...asStatementReturnType.inline.preStatements,
                ...asStatementReturnType.inline.postStatements,
              ]
        )
        .flat();
      const lastAsStatementReturnType = last(expressions);

      if (!lastAsStatementReturnType) {
        return defaultExpressionAsStatementHandler(source, config, node);
      }

      const {
        preStatements: lastPreStatements,
        postStatements,
        toReturn,
      } = asStatementReturnTypeToReturn(lastAsStatementReturnType);
      return isAsStatementReturnTypeInline(lastAsStatementReturnType)
        ? asStatementReturnTypeInline(
            [...preStatements, ...lastPreStatements],
            lastAsStatementReturnType.inlineExpression,
            postStatements
          )
        : asStatementReturnTypeWithIdentifier(
            [...preStatements, ...lastPreStatements],
            postStatements,
            toReturn
          );
    }
  );
};
