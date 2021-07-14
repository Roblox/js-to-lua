import { createHandler, HandlerFunction } from '../../types';
import {
  callExpression,
  functionExpression,
  LuaBinaryExpression,
  LuaCallExpression,
  LuaExpression,
  LuaIdentifier,
  LuaTableKeyField,
  returnStatement,
  UnhandledStatement,
} from '@js-to-lua/lua-types';
import {
  AssignmentExpression,
  BinaryExpression,
  Expression,
  Identifier,
  ObjectMethod,
  ObjectProperty,
} from '@babel/types';
import { createAssignmentStatementHandlerFunction } from './assignment-statement.handler';
import { getReturnExpressions } from '../../utils/get-return-expressions';

export const createAssignmentExpressionHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>,
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
      const assignmentStatement = createAssignmentStatementHandlerFunction(
        handleExpression,
        handleIdentifier,
        handleObjectField,
        handleBinaryExpression
      ).handler(source, config, node);
      return callExpression(
        functionExpression(
          [],
          [
            assignmentStatement,
            returnStatement(...getReturnExpressions(assignmentStatement)),
          ]
        ),
        []
      );
    }
  );
