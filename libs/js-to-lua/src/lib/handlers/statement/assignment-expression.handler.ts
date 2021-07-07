import { createHandler, HandlerFunction } from '../../types';
import {
  callExpression,
  functionExpression,
  LuaExpression,
  LuaIdentifier,
  returnStatement,
} from '@js-to-lua/lua-types';
import { AssignmentExpression, Expression, Identifier } from '@babel/types';
import { createAssignmentStatementHandlerFunction } from './assignment-statement.handler';
import { getReturnExpressions } from '../../utils/get-return-expressions';

export const createAssignmentExpressionHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>
) =>
  createHandler(
    'AssignmentExpression',
    (source, config, node: AssignmentExpression) => {
      const assignmentStatement = createAssignmentStatementHandlerFunction(
        handleExpression,
        handleIdentifier
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
