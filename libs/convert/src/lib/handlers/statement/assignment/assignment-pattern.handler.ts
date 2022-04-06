import {
  AssignmentPattern,
  Expression,
  Identifier,
  isIdentifier as isBabelIdentifier,
} from '@babel/types';
import {
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
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
  nodeGroup,
  unhandledStatement,
} from '@js-to-lua/lua-types';

export const createAssignmentPatternHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>
): HandlerFunction<AssignmentStatement, AssignmentPattern> =>
  createHandlerFunction((source, config, node: AssignmentPattern) => {
    const rightExpression = handleExpression(source, config, node.right);
    if (isBabelIdentifier(node.left)) {
      const leftExpression = handleIdentifier(source, config, node.left);
      delete leftExpression.typeAnnotation;
      return ifStatement(
        ifClause(
          binaryExpression(leftExpression, '==', nilLiteral()),
          nodeGroup([
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [leftExpression],
              [rightExpression]
            ),
          ])
        )
      );
    }
    return withTrailingConversionComment(
      unhandledStatement(),
      `ROBLOX TODO: Unhandled assignment pattern handling for type: "${node.left.type}"`,
      getNodeSource(source, node)
    );
  });