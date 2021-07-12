import { BaseNodeHandler, createHandler, HandlerFunction } from '../../types';
import {
  AssignmentStatement,
  assignmentStatement,
  LuaExpression,
  LuaLVal,
  LuaNodeGroup,
  nodeGroup,
} from '@js-to-lua/lua-types';
import {
  AssignmentExpression,
  Expression,
  Identifier,
  isAssignmentExpression as isBabelAssignmentExpression,
  LVal,
} from '@babel/types';
import { defaultExpressionHandler } from '../../utils/default-handlers';
import { getReturnExpressions } from '../../utils/get-return-expressions';

export const createAssignmentStatementHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleLVal: HandlerFunction<LuaLVal, LVal>
) => {
  const assignmentStatementHandler: BaseNodeHandler<
    LuaNodeGroup | AssignmentStatement,
    AssignmentExpression
  > = createHandler(
    'AssignmentExpression',
    (source, config, node: AssignmentExpression) => {
      const leftExpression = handleLVal(
        source,
        config,
        node.left as Identifier
      );
      const rightExpression = handleExpression(source, config, node.right);

      if (isBabelAssignmentExpression(node.right)) {
        const rightAssignmentStatement = assignmentStatementHandler.handler(
          source,
          config,
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
          return defaultExpressionHandler(source, config, node);
      }
    }
  );
  return assignmentStatementHandler;
};
