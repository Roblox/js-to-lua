import { defaultStatementHandler } from '../../utils/default-handlers';
import { combineHandlers } from '../../utils/combine-handlers';
import {
  booleanLiteral,
  expressionStatement,
  isExpression,
  LuaDeclaration,
  LuaExpression,
  LuaNodeGroup,
  LuaStatement,
  nodeGroup,
  WhileStatement,
  whileStatement,
} from '@js-to-lua/lua-types';
import {
  Declaration,
  Expression,
  ForStatement as BabelForStatement,
  isBlockStatement,
  isUpdateExpression,
  Statement,
  UpdateExpression,
} from '@babel/types';
import { BaseNodeHandler, createHandler, HandlerFunction } from '../../types';

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
): BaseNodeHandler<WhileStatement, BabelForStatement> =>
  createHandler('ForStatement', (source, config, node) => {
    const handleInitExpression = combineHandlers(
      [expressionHandler, variableDeclarationHandler],
      defaultStatementHandler
    ).handler;

    const handleStatementFn = handleStatement(source, config);
    const body = (
      isBlockStatement(node.body) ? node.body.body : [node.body]
    ).map(handleStatementFn);

    const updateStatements = (
      node.update
        ? [
            isUpdateExpression(node.update)
              ? handleUpdateExpressionAsStatement(source, config, node.update)
              : handleExpressionAsStatement(source, config, node.update),
          ]
        : []
    ).map((someNode) =>
      isExpression(someNode) ? expressionStatement(someNode) : someNode
    );

    const testExpression = node.test
      ? expressionHandler.handler(source, config, node.test)
      : booleanLiteral(true);

    const whileNode = whileStatement(testExpression, [
      ...body,
      ...updateStatements,
    ]);
    return node.init
      ? nodeGroup([handleInitExpression(source, config, node.init), whileNode])
      : whileNode;
  });
