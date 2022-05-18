import { Expression, Statement, SwitchStatement } from '@babel/types';
import {
  AsStatementHandlerFunction,
  combineOptionalHandlerFunctions,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { LuaExpression, LuaStatement } from '@js-to-lua/lua-types';
import { createSwitchStatementAllCasesReturningOptionalHandler } from './switch-statement-all-cases-returning-optional.handler';
import { createSwitchStatementDefaultHandler } from './switch-statement-default.handler';

export const createSwitchStatementHandler = (
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Expression
  >
) =>
  createHandler<LuaStatement, SwitchStatement>(
    'SwitchStatement',
    (source, config, node) => {
      const handleSpecialCases = combineOptionalHandlerFunctions([
        createSwitchStatementAllCasesReturningOptionalHandler(
          handleStatement,
          handleExpression,
          handleExpressionAsStatement
        ),
      ]);

      const optionalResult = handleSpecialCases(source, config, node);

      if (optionalResult) {
        return optionalResult;
      }

      const { handler: defaultHandler } = createSwitchStatementDefaultHandler(
        handleStatement,
        handleExpression,
        handleExpressionAsStatement
      );

      return defaultHandler(source, config, node);
    }
  );
