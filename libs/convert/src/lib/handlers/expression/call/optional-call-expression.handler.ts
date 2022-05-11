import * as Babel from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  binaryExpression,
  callExpression,
  elseExpressionClause,
  identifier,
  ifClause,
  ifElseExpression,
  ifExpressionClause,
  isMemberExpression,
  ifStatement,
  isIdentifier,
  LuaExpression,
  LuaStatement,
  nilLiteral,
  nodeGroup,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  functionExpression,
  returnStatement,
} from '@js-to-lua/lua-types';
import { generateUniqueIdentifier } from '../../generate-unique-identifier';
import { createCallExpressionArgumentsHandler } from './call-expression-arguments.handler';

export const createOptionalCallExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>
) => {
  return createHandler<LuaExpression, Babel.OptionalCallExpression>(
    'OptionalCallExpression',
    (source, config, node) => {
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
        return ifElseExpression(
          ifExpressionClause(
            binaryExpression(calleeExpression, '~=', nilLiteral()),
            callExpression(calleeExpression, args)
          ),
          elseExpressionClause(nilLiteral())
        );
      }

      const refId = identifier(generateUniqueIdentifier([], 'ref'));

      return callExpression(
        functionExpression(
          [],
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(refId)],
              [variableDeclaratorValue(calleeExpression)]
            ),
            returnStatement(
              ifElseExpression(
                ifExpressionClause(
                  binaryExpression(refId, '~=', nilLiteral()),
                  callExpression(refId, args)
                ),
                elseExpressionClause(nilLiteral())
              )
            ),
          ])
        )
      );
    }
  );
};

export const createOptionalCallExpressionAsStatementHandler = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>
) => {
  return createHandler<
    LuaExpression | LuaStatement,
    Babel.OptionalCallExpression
  >('OptionalCallExpression', (source, config, node) => {
    const calleeExpression = handleExpression(source, config, node.callee);

    // TODO: extract this logic and "&&" logical expression handling logic into one
    if (
      isIdentifier(calleeExpression) ||
      isMemberExpression(calleeExpression)
    ) {
      return ifStatement(
        ifClause(
          binaryExpression(calleeExpression, '~=', nilLiteral()),
          nodeGroup([callExpression(calleeExpression)])
        )
      );
    }

    const refId = identifier(generateUniqueIdentifier([], 'ref'));

    return callExpression(
      functionExpression(
        [],
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(refId)],
            [variableDeclaratorValue(calleeExpression)]
          ),
          ifStatement(
            ifClause(
              binaryExpression(refId, '~=', nilLiteral()),
              nodeGroup([callExpression(refId)])
            )
          ),
        ])
      )
    );
  });
};
