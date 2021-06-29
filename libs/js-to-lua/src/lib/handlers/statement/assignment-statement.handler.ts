import { BaseNodeHandler, createHandler, HandlerFunction } from '../../types';
import {
  AssignmentStatement,
  assignmentStatement,
  LuaExpression,
  LuaIdentifier,
  LuaNodeGroup,
  nodeGroup,
} from '@js-to-lua/lua-types';
import {
  AssignmentExpression,
  Expression,
  Identifier,
  isAssignmentExpression as isBabelAssignmentExpression,
} from '@babel/types';
import { defaultExpressionHandler } from '../../utils/default-handlers';
import { getReturnExpressions } from '../../utils/get-return-expressions';

export const createAssignmentStatementHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>
) => {
  const assignmentStatementHandler: BaseNodeHandler<
    LuaNodeGroup | AssignmentStatement,
    AssignmentExpression
  > = createHandler(
    'AssignmentExpression',
    (source, node: AssignmentExpression) => {
      const leftExpression = handleIdentifier(source, node.left as Identifier);
      const rightExpression = handleExpression(source, node.right);

      if (isBabelAssignmentExpression(node.right)) {
        const rightAssignmentStatement = assignmentStatementHandler.handler(
          source,
          node.right
        );

        const returnExpressions = getReturnExpressions(
          rightAssignmentStatement
        );

        return nodeGroup([
          rightAssignmentStatement,
          assignmentStatement([leftExpression], returnExpressions),
        ]);
      }

      switch (node.operator) {
        case '=':
          return assignmentStatement([leftExpression], [rightExpression]);
        default:
          return defaultExpressionHandler(source, node);
      }
    }
  );
  return assignmentStatementHandler;
};
