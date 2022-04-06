import {
  Declaration,
  Expression,
  ForStatement as BabelForStatement,
  isUpdateExpression,
  isVariableDeclaration,
  Statement,
  UpdateExpression,
} from '@babel/types';
import {
  BaseNodeHandler,
  combineHandlers,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  createExpressionStatement,
  defaultStatementHandler,
} from '@js-to-lua/lua-conversion-utils';
import {
  blockStatement,
  booleanLiteral,
  isExpression,
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
  handleExpressionAsStatement: HandlerFunction<
    LuaExpression | LuaStatement,
    Expression
  >,
  handleUpdateExpressionAsStatement: HandlerFunction<
    LuaStatement,
    UpdateExpression
  >,
  expressionHandler: BaseNodeHandler<LuaExpression, Expression>,
  variableDeclarationHandler: BaseNodeHandler<
    LuaNodeGroup | LuaDeclaration,
    Declaration
  >
): BaseNodeHandler<
  LuaNodeGroup<LuaExpression | WhileStatement>,
  BabelForStatement
> =>
  createHandler('ForStatement', (source, config, node) => {
    const handleInitExpression = combineHandlers(
      [
        { type: expressionHandler.type, handler: handleExpressionAsStatement },
        variableDeclarationHandler,
      ],
      defaultStatementHandler
    ).handler;

    const handleBody = createInnerBodyStatementHandler(handleStatement);

    const updateStatements = (
      node.update
        ? [
            {
              node: isUpdateExpression(node.update)
                ? handleUpdateExpressionAsStatement(source, config, node.update)
                : handleExpressionAsStatement(source, config, node.update),
              update: node.update,
            },
          ]
        : []
    ).map(({ node: someNode, update }) =>
      isExpression(someNode)
        ? createExpressionStatement(source, update, someNode)
        : someNode
    );

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
