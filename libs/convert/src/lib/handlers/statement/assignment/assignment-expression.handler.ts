import {
  AssignmentExpression,
  BinaryExpression,
  Expression,
  LVal,
  ObjectMethod,
  ObjectProperty,
} from '@babel/types';
import {
  AsStatementHandlerFunction,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { asStatementReturnTypeToExpression } from '@js-to-lua/lua-conversion-utils';
import {
  LuaBinaryExpression,
  LuaCallExpression,
  LuaExpression,
  LuaLVal,
  LuaStatement,
  LuaTableKeyField,
  UnhandledStatement,
} from '@js-to-lua/lua-types';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createAssignmentExpressionAsStatementHandlerFunction } from './assignment-expression-as-statement.handler';

export const createAssignmentExpressionHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Expression
  >,
  handleLVal: HandlerFunction<LuaLVal, LVal>,
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    ObjectMethod | ObjectProperty
  >,
  handleBinaryExpression: HandlerFunction<
    LuaBinaryExpression | LuaCallExpression | UnhandledStatement,
    BinaryExpression
  >
) =>
  createHandler(
    'AssignmentExpression',
    (source, config, node: AssignmentExpression) => {
      const assignmentStatement =
        createAssignmentExpressionAsStatementHandlerFunction(
          handleExpression,
          handleExpressionAsStatement,
          handleLVal,
          handleIdentifierStrict,
          handleObjectField,
          handleBinaryExpression
        ).handler(source, config, node);
      return asStatementReturnTypeToExpression(assignmentStatement);
    }
  );
