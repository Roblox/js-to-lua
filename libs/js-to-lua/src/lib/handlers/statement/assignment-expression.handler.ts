import { createHandler, HandlerFunction } from '../../types';
import {
  callExpression,
  functionExpression,
  LuaExpression,
  LuaIdentifier,
  LuaTableKeyField,
  returnStatement,
} from '@js-to-lua/lua-types';
import {
  AssignmentExpression,
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
  >
) =>
  createHandler(
    'AssignmentExpression',
    (source, config, node: AssignmentExpression) => {
      const assignmentStatement = createAssignmentStatementHandlerFunction(
        handleExpression,
        handleIdentifier,
        handleObjectField
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
