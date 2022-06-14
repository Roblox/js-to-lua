import * as Babel from '@babel/types';
import {
  AsStatementHandlerFunction,
  createHandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToStatement,
  unwrapStatement,
} from '@js-to-lua/lua-conversion-utils';
import { LuaStatement } from '@js-to-lua/lua-types';

export const createUpdateExpressionHandlerFunction = (
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Babel.Expression
  >
) => {
  return createHandlerFunction<LuaStatement, Babel.Expression>(
    (source, config, update) => {
      const asStatementResult = handleExpressionAsStatement(
        source,
        config,
        update
      );
      return unwrapStatement(
        asStatementReturnTypeToStatement(source, update, asStatementResult)
      );
    }
  );
};
