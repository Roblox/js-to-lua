import {
  ArrayPattern,
  AssignmentExpression,
  Expression,
  LVal,
} from '@babel/types';
import {
  asStatementReturnTypeWithIdentifier,
  createAsStatementHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  unhandledIdentifier,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  LuaExpression,
  LuaLVal,
  LuaStatement,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import {
  createArrayPatternDestructuringHandler,
  hasUnhandledArrayDestructuringParam,
} from '../../pattern/array-pattern-destructuring.handler';

export const createArrayPatternDestructuringAssignmentAsStatementHandlerFunction =
  (
    handleExpression: HandlerFunction<LuaExpression, Expression>,
    handleLVal: HandlerFunction<LuaLVal, LVal>
  ) => {
    return createAsStatementHandlerFunction<
      LuaStatement,
      AssignmentExpression & { left: ArrayPattern }
    >((source, config, node) => {
      const arrayPatternDestructuringHandler =
        createArrayPatternDestructuringHandler(handleExpression);
      if (
        hasUnhandledArrayDestructuringParam(node.left.elements.filter(isTruthy))
      ) {
        return asStatementReturnTypeWithIdentifier(
          [
            withTrailingConversionComment(
              unhandledStatement(),
              `ROBLOX TODO: Unhandled node for ArrayPattern assignment when one of the elements is not supported`,
              getNodeSource(source, node)
            ),
          ],
          [],
          unhandledIdentifier()
        );
      }

      const expression = handleExpression(source, config, node.right);
      const assignmentStatements = arrayPatternDestructuringHandler(
        source,
        config,
        node.left.elements.filter(isTruthy),
        expression
      ).map((item) =>
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          item.ids.map((id) => handleLVal(source, config, id)),
          item.values.filter(isTruthy)
        )
      );
      return asStatementReturnTypeWithIdentifier(
        assignmentStatements,
        [],
        expression
      );
    });
  };
