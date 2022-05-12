import {
  Declaration,
  Expression,
  ForStatement as BabelForStatement,
  isVariableDeclaration,
  Statement,
} from '@babel/types';
import {
  AsStatementHandlerFunction,
  BaseNodeHandler,
  combineHandlers,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToStatement,
  defaultStatementHandler,
  unwrapStatement,
} from '@js-to-lua/lua-conversion-utils';
import {
  blockStatement,
  booleanLiteral,
  LuaDeclaration,
  LuaExpression,
  LuaNodeGroup,
  LuaStatement,
  nodeGroup,
  WhileStatement,
  whileStatement,
} from '@js-to-lua/lua-types';
import { createInnerBodyStatementHandler } from '../inner-statement-body-handler';
import { withContinueStatementHandlerConfig } from './continue-statement-handler-config';

export const createForStatementHandler = (
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Expression
  >,
  expressionHandler: BaseNodeHandler<LuaExpression, Expression>,
  declarationHandler: BaseNodeHandler<
    LuaNodeGroup | LuaDeclaration,
    Declaration
  >
): BaseNodeHandler<LuaNodeGroup<WhileStatement>, BabelForStatement> =>
  createHandler('ForStatement', (source, config, node) => {
    const handleInitExpression = combineHandlers(
      [
        createHandler<LuaStatement, Expression>(
          expressionHandler.type,
          (source, config, expression) =>
            asStatementReturnTypeToStatement(
              source,
              expression,
              handleExpressionAsStatement(source, config, expression)
            )
        ),
        declarationHandler,
      ],
      defaultStatementHandler
    ).handler;

    const handleBody = createInnerBodyStatementHandler(handleStatement);

    const updateStatements = (
      node.update
        ? [
            {
              node: handleExpressionAsStatement(source, config, node.update),
              update: node.update,
            },
          ]
        : []
    )
      .map(({ node: someNode, update }) =>
        asStatementReturnTypeToStatement(source, update, someNode)
      )
      .map(unwrapStatement);

    const body = handleBody(
      source,
      withContinueStatementHandlerConfig(updateStatements, config),
      node.body
    );

    const testExpression = node.test
      ? expressionHandler.handler(source, config, node.test)
      : booleanLiteral(true);

    const whileNode = whileStatement(testExpression, [
      ...(body && body.body.length ? [body] : []),
      ...(updateStatements.length ? [nodeGroup(updateStatements)] : []),
    ]);

    return isVariableDeclaration(node.init)
      ? blockStatement([
          handleInitExpression(source, config, node.init),
          whileNode,
        ])
      : node.init
      ? nodeGroup([handleInitExpression(source, config, node.init), whileNode])
      : whileNode;
  });
