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
import {
  BaseNodeHandler,
  createHandler,
  EmptyConfig,
  HandlerFunction,
} from '../types';
import { createExpressionAsBooleanHandler } from './handle-as-boolean';

export const createIfStatementHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleStatement: HandlerFunction<LuaStatement, Statement>
): BaseNodeHandler<LuaIfStatement, IfStatement> =>
  createHandler('IfStatement', (source, config, node) => {
    const expressionAsBooleanHandler = createExpressionAsBooleanHandler(
      handleExpression
    );

    const alternates = node.alternate
      ? handleAlternate(source, config, node.alternate)
      : [];

    const alternateElseifClauses: LuaElseifClause[] = alternates.filter(
      isElseifClause
    );
    const alternateElseClause: LuaElseClause | undefined = alternates.find(
      isElseClause
    );

    return ifStatement(
      ifClause(
        expressionAsBooleanHandler(source, config, node.test),
        handleConsequent(source, config, node.consequent)
      ),
      alternateElseifClauses,
      alternateElseClause
    );

    function handleAlternate(
      source: string,
      config: EmptyConfig,
      node: Statement
    ): Array<LuaElseifClause | LuaElseClause> {
      if (node.type === 'IfStatement') {
        return [
          elseifClause(
            expressionAsBooleanHandler(source, config, node.test),
            handleConsequent(source, config, node.consequent)
          ),
          ...(node.alternate
            ? handleAlternate(source, config, node.alternate)
            : []),
        ];
      }
      return [elseClause(handleConsequent(source, config, node))];
    }

    function handleConsequent(
      source: string,
      config: EmptyConfig,
      node: Statement
    ) {
      const handleStatement_ = handleStatement(source, config);
      return node.type === 'BlockStatement'
        ? node.body.map(handleStatement_)
        : [handleStatement(source, config, node)];
    }
  });
