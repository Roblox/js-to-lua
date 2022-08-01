import * as Babel from '@babel/types';
import {
  AsStatementHandlerFunction,
  AsStatementReturnType,
  createAsStatementHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  LuaExpression,
  LuaStatement,
  LuaTableConstructor,
  LuaTableKeyField,
} from '@js-to-lua/lua-types';
import { NoSpreadObjectProperty } from '../object-expression.types';
import { createObjectExpressionWithSpreadAsStatementHandler } from './object-expression-with-spread-as-statement.handler';
import { createObjectExpressionWithoutSpreadAsStatementHandler } from './object-expression-without-spread-as-statement.handler';

export const createObjectExpressionAsStatementHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Babel.Expression>,
  objectFieldHandlerAsStatementFunction: AsStatementHandlerFunction<
    LuaStatement,
    NoSpreadObjectProperty,
    LuaTableConstructor<[LuaTableKeyField]>
  >
) => {
  const handleObjectExpressionWithSpreadAsStatement =
    createObjectExpressionWithSpreadAsStatementHandler(
      expressionHandlerFunction,
      objectFieldHandlerAsStatementFunction
    );

  const handleObjectExpressionWithoutSpreadAsStatement =
    createObjectExpressionWithoutSpreadAsStatementHandler(
      objectFieldHandlerAsStatementFunction
    );

  return createAsStatementHandler(
    'ObjectExpression',
    (
      source,
      config,
      expression: Babel.ObjectExpression
    ): AsStatementReturnType => {
      return expression.properties.every((prop) => !Babel.isSpreadElement(prop))
        ? handleObjectExpressionWithoutSpreadAsStatement(
            source,
            config,
            expression
          )
        : handleObjectExpressionWithSpreadAsStatement(
            source,
            config,
            expression
          );
    }
  );
};
