import {
  AssignmentExpression,
  Expression,
  isIdentifier as isBabelIdentifier,
  isObjectProperty,
  LVal,
  ObjectMethod,
  ObjectPattern,
  ObjectProperty,
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
  blockStatement,
  identifier,
  LuaExpression,
  LuaLVal,
  LuaStatement,
  LuaTableKeyField,
  unhandledStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import {
  createObjectPatternDestructuringHandler,
  hasUnhandledObjectDestructuringParam,
} from '../../pattern/object-pattern-destructuring.handler';

export const createObjectPatternDestructuringAssignmentHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleLVal: HandlerFunction<LuaLVal, LVal>,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    ObjectMethod | ObjectProperty
  >
) => {
  return createHandlerFunction<
    LuaStatement,
    AssignmentExpression & { left: ObjectPattern }
  >((source, config, node) => {
    if (
      hasUnhandledObjectDestructuringParam(
        node.left.properties.filter((property) =>
          isObjectProperty(property)
        ) as ObjectProperty[]
      )
    ) {
      return withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX TODO: Unhandled AssignmentStatement when one of the object properties is not supported`,
        getNodeSource(source, node)
      );
    }

    const objectPatternDestructuringHandler =
      createObjectPatternDestructuringHandler(
        handleExpression,
        handleLVal,
        handleObjectField
      );
    if (isBabelIdentifier(node.right)) {
      const destructured = objectPatternDestructuringHandler(
        source,
        config,
        handleExpression(source, config, node.right),
        node.left.properties
      );
      return assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        destructured.ids,
        destructured.values.filter(isTruthy)
      );
    } else {
      const helperIdentifier = identifier(`ref`);
      const destructured = objectPatternDestructuringHandler(
        source,
        config,
        helperIdentifier,
        node.left.properties
      );
      return blockStatement([
        variableDeclaration(
          [variableDeclaratorIdentifier(helperIdentifier)],
          [
            variableDeclaratorValue(
              handleExpression(source, config, node.right)
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          destructured.ids,
          destructured.values.filter(isTruthy)
        ),
      ]);
    }
  });
};
