import { createHandlerFunction, HandlerFunction } from '../../types';
import {
  assignmentStatement,
  AssignmentStatement,
  binaryExpression,
  ifClause,
  ifStatement,
  LuaExpression,
  LuaIdentifier,
  nilLiteral,
} from '@js-to-lua/lua-types';
import { AssignmentPattern, Expression, Identifier } from '@babel/types';

export const createAssignmentPatternHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>
): HandlerFunction<AssignmentStatement, AssignmentPattern> =>
  createHandlerFunction((source, node: AssignmentPattern) => {
    const leftExpression = handleIdentifier(source, node.left as Identifier);
    const rightExpression = handleExpression(source, node.right);
    return ifStatement(
      ifClause(binaryExpression(leftExpression, '==', nilLiteral()), [
        assignmentStatement([leftExpression], [rightExpression]),
      ])
    );
  });
