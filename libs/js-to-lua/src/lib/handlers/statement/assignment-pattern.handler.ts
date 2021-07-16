import { createHandlerFunction, HandlerFunction } from '../../types';
import {
  assignmentStatement,
  AssignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  ifClause,
  ifStatement,
  LuaExpression,
  LuaIdentifier,
  nilLiteral,
  unhandledStatement,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import {
  AssignmentPattern,
  Expression,
  Identifier,
  isIdentifier as isBabelIdentifier,
} from '@babel/types';

export const createAssignmentPatternHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>
): HandlerFunction<AssignmentStatement, AssignmentPattern> =>
  createHandlerFunction((source, config, node: AssignmentPattern) => {
    const rightExpression = handleExpression(source, config, node.right);
    if (isBabelIdentifier(node.left)) {
      const leftExpression = handleIdentifier(source, config, node.left);
      return ifStatement(
        ifClause(binaryExpression(leftExpression, '==', nilLiteral()), [
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [leftExpression],
            [rightExpression]
          ),
        ])
      );
    }
    return withTrailingConversionComment(
      unhandledStatement(),
      `ROBLOX TODO: Unhandled assignment pattern handling for type: "${node.left.type}"`,
      source.slice(node.start || 0, node.end || 0)
    );
  });
