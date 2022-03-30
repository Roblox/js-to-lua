import {
  ArrayPattern,
  AssignmentExpression,
  Expression,
  LVal,
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
  AssignmentStatementOperatorEnum,
  LuaExpression,
  LuaLVal,
  LuaStatement,
  nodeGroup,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import {
  createArrayPatternDestructuringHandler,
  hasUnhandledArrayDestructuringParam,
} from '../../pattern/array-pattern-destructuring.handler';

export const createArrayPatternDestructuringAssignmentHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleLVal: HandlerFunction<LuaLVal, LVal>
) => {
  return createHandlerFunction<
    LuaStatement,
    AssignmentExpression & { left: ArrayPattern }
  >((source, config, node) => {
    const arrayPatternDestructuringHandler =
      createArrayPatternDestructuringHandler(handleExpression);
    if (
      hasUnhandledArrayDestructuringParam(node.left.elements.filter(isTruthy))
    ) {
      return nodeGroup([
        withTrailingConversionComment(
          unhandledStatement(),
          `ROBLOX TODO: Unhandled node for ArrayPattern assignment when one of the elements is not supported`,
          getNodeSource(source, node)
        ),
      ]);
    }

    return nodeGroup(
      arrayPatternDestructuringHandler(
        source,
        config,
        node.left.elements.filter(isTruthy),
        handleExpression(source, config, node.right)
      ).map((item) =>
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          item.ids.map((id) => handleLVal(source, config, id)),
          item.values.filter(isTruthy)
        )
      )
    );
  });
};
