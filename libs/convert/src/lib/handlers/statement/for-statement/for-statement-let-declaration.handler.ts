import traverse from '@babel/traverse';
import * as Babel from '@babel/types';
import {
  AsStatementHandlerFunction,
  BaseNodeHandler,
  createOptionalHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { generateUniqueIdentifier } from '@js-to-lua/lua-conversion-utils';
import {
  blockStatement,
  booleanLiteral,
  callExpression,
  expressionStatement,
  functionDeclaration,
  identifier,
  isVariableDeclaration,
  LuaDeclaration,
  LuaExpression,
  LuaNodeGroup,
  LuaStatement,
  nodeGroup,
  whileStatement,
} from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { createInnerBodyStatementHandler } from '../../inner-statement-body-handler';
import { withContinueStatementHandlerConfig } from '../continue-statement-handler-config';
import { createUpdateExpressionHandlerFunction } from './update-expression.handler';

export const createForStatementLetDeclarationOptionalHandler = (
  handleStatement: HandlerFunction<LuaStatement, Babel.Statement>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Babel.Expression
  >,
  expressionHandler: BaseNodeHandler<LuaExpression, Babel.Expression>,
  declarationHandler: BaseNodeHandler<
    LuaNodeGroup | LuaDeclaration,
    Babel.Declaration
  >
) => {
  const handleBody = createInnerBodyStatementHandler(handleStatement);
  const handleUpdateExpressionHandlerFunction =
    createUpdateExpressionHandlerFunction(handleExpressionAsStatement);

  return createOptionalHandlerFunction<LuaStatement, Babel.ForStatement>(
    (source, config, node) => {
      if (isLetDeclarationForStatement(node)) {
        const initStatement = declarationHandler.handler(
          source,
          config,
          node.init
        );

        if (!isVariableDeclaration(initStatement)) {
          return;
        }

        const initIdentifiers = initStatement.identifiers.map(
          ({ value }) => value
        );

        const handleUpdateExpression = handleUpdateExpressionHandlerFunction(
          source,
          config
        );

        const updateStatements = [node.update]
          .filter(isTruthy)
          .map(handleUpdateExpression);

        const body = handleBody(
          source,
          withContinueStatementHandlerConfig(updateStatements, config),
          node.body
        );

        const loopFunctionId = identifier(
          generateUniqueIdentifier([], '_loop')
        );
        const loopFunctionDeclaration = functionDeclaration(
          loopFunctionId,
          initIdentifiers,
          body
        );
        const loopFunctionCall = expressionStatement(
          callExpression(loopFunctionId, initIdentifiers)
        );

        const testExpression = node.test
          ? expressionHandler.handler(source, config, node.test)
          : booleanLiteral(true);

        const whileNode = whileStatement(testExpression, [
          nodeGroup([loopFunctionCall]),
          ...(updateStatements.length ? [nodeGroup(updateStatements)] : []),
        ]);

        return blockStatement([
          loopFunctionDeclaration,
          initStatement,
          whileNode,
        ]);
      }
    }
  );
};

function isLetDeclarationForStatement(
  statement: Babel.ForStatement
): statement is Omit<Babel.ForStatement, 'init'> & {
  init: Babel.VariableDeclaration;
} {
  if (
    Babel.isVariableDeclaration(statement.init) &&
    statement.init.kind === 'let'
  ) {
    let usesInitId = false;
    const initIds = statement.init.declarations
      .map(({ id }) => id)
      .filter((id): id is Babel.Identifier => Babel.isIdentifier(id));

    traverse(statement, {
      Function: (path) => {
        if (usesInitId) {
          path.stop();
          return;
        }
        traverse(path.node, {
          Identifier: (path) => {
            if (usesInitId) {
              path.stop();
              return;
            }
            if (initIds.some(({ name }) => path.isIdentifier({ name }))) {
              usesInitId = true;
              path.stop();
            }
          },
          noScope: true,
        });
      },
      noScope: true,
    });

    return usesInitId;
  }
  return false;
}
