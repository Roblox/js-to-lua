import { Expression, IfStatement, Statement } from '@babel/types';
import {
  elseClause,
  elseifClause,
  ifClause,
  ifStatement,
  isElseClause,
  isElseifClause,
  LuaElseClause,
  LuaElseifClause,
  LuaExpression,
  LuaIfStatement,
  LuaStatement,
} from '@js-to-lua/lua-types';
import { BaseNodeHandler, createHandler, HandlerFunction } from '../types';
import { createExpressionAsBooleanHandler } from './handle-as-boolean';

export const createIfStatementHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleStatement: HandlerFunction<LuaStatement, Statement>
): BaseNodeHandler<LuaIfStatement, IfStatement> =>
  createHandler('IfStatement', (source, node) => {
    const expressionAsBooleanHandler = createExpressionAsBooleanHandler(
      handleExpression
    );

    const alternates = node.alternate
      ? handleAlternate(source, node.alternate)
      : [];

    const alternateElseifClauses: LuaElseifClause[] = alternates.filter(
      (node) => isElseifClause(node)
    );
    const alternateElseClause: LuaElseClause = alternates.find((node) =>
      isElseClause(node)
    );

    return ifStatement(
      ifClause(
        expressionAsBooleanHandler(source, node.test),
        handleConsequent(source, node.consequent)
      ),
      alternateElseifClauses,
      alternateElseClause
    );

    function handleAlternate(source, node) {
      if (node.type === 'IfStatement') {
        return [
          elseifClause(
            expressionAsBooleanHandler(source, node.test),
            handleConsequent(source, node.consequent)
          ),
          ...(node.alternate ? handleAlternate(source, node.alternate) : []),
        ];
      }
      return [elseClause(handleConsequent(source, node))];
    }

    function handleConsequent(source, node) {
      return node.type === 'BlockStatement'
        ? node.body.map(handleStatement(source))
        : [handleStatement(source, node)];
    }
  });
