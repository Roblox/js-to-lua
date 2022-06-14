import * as Babel from '@babel/types';
import {
  AsStatementHandlerFunction,
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  blockStatement,
  booleanLiteral,
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
import { createForStatementLetDeclarationOptionalHandler } from './for-statement-let-declaration.handler';
import { createInitExpressionHandler } from './init-expression.handler';
import { createUpdateExpressionHandlerFunction } from './update-expression.handler';

export const createForStatementHandler = (
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
  const handleInitExpression = createInitExpressionHandler(
    handleExpressionAsStatement,
    expressionHandler
  );
  const handleBody = createInnerBodyStatementHandler(handleStatement);
  const simpleForStatementHandler =
    createForStatementLetDeclarationOptionalHandler(
      handleStatement,
      handleExpressionAsStatement,
      expressionHandler,
      declarationHandler
    );
  const handleUpdateExpressionHandlerFunction =
    createUpdateExpressionHandlerFunction(handleExpressionAsStatement);

  return createHandler<LuaStatement, Babel.ForStatement>(
    'ForStatement',
    (source, config, node) => {
      const result = simpleForStatementHandler(source, config, node);

      if (result) {
        return result;
      }

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

      const testExpression = node.test
        ? expressionHandler.handler(source, config, node.test)
        : booleanLiteral(true);

      const whileNode = whileStatement(testExpression, [
        ...(body.body.length ? [body] : []),
        ...(updateStatements.length ? [nodeGroup(updateStatements)] : []),
      ]);

      return Babel.isVariableDeclaration(node.init)
        ? blockStatement([
            declarationHandler.handler(source, config, node.init),
            whileNode,
          ])
        : node.init
        ? nodeGroup([
            handleInitExpression(source, config, node.init),
            whileNode,
          ])
        : whileNode;
    }
  );
};
