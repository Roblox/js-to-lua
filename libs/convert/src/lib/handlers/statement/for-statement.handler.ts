import {
  Declaration,
  Expression,
  ForStatement as BabelForStatement,
  isUpdateExpression,
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
      [expressionHandler, variableDeclarationHandler],
      defaultStatementHandler
    ).handler;

    const handleBody = createInnerBodyStatementHandler(handleStatement);

    const body = handleBody(source, config, node.body);

    const updateStatements = (
      node.update
        ? [
            isUpdateExpression(node.update)
              ? handleUpdateExpressionAsStatement(source, config, node.update)
              : handleExpressionAsStatement(source, config, node.update),
          ]
        : []
    ).map((someNode) =>
      isExpression(someNode)
        ? createExpressionStatement(source, node.update!, someNode)
        : someNode
    );

    const testExpression = node.test
      ? expressionHandler.handler(source, config, node.test)
      : booleanLiteral(true);

    const whileNode = whileStatement(testExpression, [
      ...(body && body.body.length ? [body] : []),
      ...(updateStatements.length ? [nodeGroup(updateStatements)] : []),
    ]);

    return nodeGroup(
      node.init
        ? [handleInitExpression(source, config, node.init), whileNode]
        : [whileNode]
    );
  });
