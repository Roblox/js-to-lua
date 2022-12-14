import * as Babel from '@babel/types';
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
    handleExpression: HandlerFunction<LuaExpression, Babel.Expression>,
    handleLVal: HandlerFunction<LuaLVal, Babel.LVal>
  ) => {
    return createAsStatementHandlerFunction<
      LuaStatement,
      Babel.AssignmentExpression & { left: Babel.ArrayPattern }
    >((source, config, node) => {
      const arrayPatternDestructuringHandler =
        createArrayPatternDestructuringHandler(handleExpression);
      const elements = node.left.elements.map(
        (x) => x || Babel.arrayPattern([])
      );
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
        elements,
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
