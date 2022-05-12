import * as Babel from '@babel/types';
import {
  asStatementInline,
  AsStatementReturnType,
  asStatementReturnTypeStandaloneOrInline,
  asStatementStandalone,
  createAsStatementHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToExpression,
  generateUniqueIdentifier,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  callExpression,
  elseExpressionClause,
  expressionStatement,
  identifier,
  ifClause,
  ifElseExpression,
  ifExpressionClause,
  ifStatement,
  isIdentifier,
  isMemberExpression,
  LuaExpression,
  LuaStatement,
  nilLiteral,
  nodeGroup,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { createCallExpressionArgumentsHandler } from './call-expression-arguments.handler';

export const createOptionalCallExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>
) => {
  return createHandler<LuaExpression, Babel.OptionalCallExpression>(
    'OptionalCallExpression',
    (source, config, node) => {
      const handleOptionalCallExpressionAsStatement =
        createOptionalCallExpressionAsStatementHandler(
          handleExpression
        ).handler;
      const result = handleOptionalCallExpressionAsStatement(
        source,
        config,
        node
      );
      return asStatementReturnTypeToExpression(result);
    }
  );
};

export const createOptionalCallExpressionAsStatementHandler = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>
) => {
  return createAsStatementHandler<LuaStatement, Babel.OptionalCallExpression>(
    'OptionalCallExpression',
    (source, config, node): AsStatementReturnType => {
      const calleeExpression = handleExpression(source, config, node.callee);

      const args = createCallExpressionArgumentsHandler(handleExpression)(
        source,
        config,
        node.arguments
      );

      // TODO: extract this logic and "&&" logical expression handling logic into one
      if (
        isIdentifier(calleeExpression) ||
        isMemberExpression(calleeExpression)
      ) {
        return asStatementReturnTypeStandaloneOrInline(
          asStatementStandalone(
            [],
            ifStatement(
              ifClause(
                binaryExpression(calleeExpression, '~=', nilLiteral()),
                nodeGroup([
                  expressionStatement(callExpression(calleeExpression, args)),
                ])
              )
            ),
            []
          ),
          asStatementInline(
            [],
            [],
            ifElseExpression(
              ifExpressionClause(
                binaryExpression(calleeExpression, '~=', nilLiteral()),
                callExpression(calleeExpression, args)
              ),
              elseExpressionClause(nilLiteral())
            )
          )
        );
      }

      const refId = identifier(generateUniqueIdentifier([], 'ref'));

      return asStatementReturnTypeStandaloneOrInline(
        asStatementStandalone<LuaStatement>(
          [
            variableDeclaration(
              [variableDeclaratorIdentifier(refId)],
              [variableDeclaratorValue(calleeExpression)]
            ),
          ],
          ifStatement(
            ifClause(
              binaryExpression(refId, '~=', nilLiteral()),
              nodeGroup([expressionStatement(callExpression(refId, args))])
            )
          ),
          []
        ),
        asStatementInline(
          [
            variableDeclaration(
              [variableDeclaratorIdentifier(refId)],
              [variableDeclaratorValue(calleeExpression)]
            ),
          ],
          [],
          ifElseExpression(
            ifExpressionClause(
              binaryExpression(refId, '~=', nilLiteral()),
              callExpression(refId, args)
            ),
            elseExpressionClause(nilLiteral())
          )
        )
      );
    }
  );
};
