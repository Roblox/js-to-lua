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
  AsStatementReturnType,
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
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import {
  createObjectPatternDestructuringHandler,
  hasUnhandledObjectDestructuringParam,
} from '../../pattern/object-pattern-destructuring.handler';

export const createObjectPatternDestructuringAssignmentAsStatementHandlerFunction =
  (
    handleExpression: HandlerFunction<LuaExpression, Expression>,
    handleLVal: HandlerFunction<LuaLVal, LVal>,
    handleIdentifierStrict: IdentifierStrictHandlerFunction,
    handleObjectField: HandlerFunction<
      LuaTableKeyField,
      ObjectMethod | ObjectProperty
    >
  ) => {
    return createAsStatementHandlerFunction<
      LuaStatement,
      AssignmentExpression & { left: ObjectPattern }
    >((source, config, node): AsStatementReturnType<LuaStatement> => {
      if (
        hasUnhandledObjectDestructuringParam(
          node.left.properties.filter((property): property is ObjectProperty =>
            isObjectProperty(property)
          )
        )
      ) {
        return asStatementReturnTypeWithIdentifier(
          [
            withTrailingConversionComment(
              unhandledStatement(),
              `ROBLOX TODO: Unhandled AssignmentStatement when one of the object properties is not supported`,
              getNodeSource(source, node)
            ),
          ],
          [],
          unhandledIdentifier()
        );
      }

      const objectPatternDestructuringHandler =
        createObjectPatternDestructuringHandler(
          handleExpression,
          handleLVal,
          handleIdentifierStrict,
          handleObjectField
        );
      if (isBabelIdentifier(node.right)) {
        const rightExpression = handleIdentifierStrict(
          source,
          config,
          node.right
        );
        const destructured = objectPatternDestructuringHandler(
          source,
          config,
          rightExpression,
          node.left.properties
        );
        return asStatementReturnTypeWithIdentifier(
          [
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              destructured.ids,
              destructured.values.filter(isTruthy)
            ),
          ],
          [],
          rightExpression
        );
      } else {
        const helperIdentifier = identifier(`ref`);
        const destructured = objectPatternDestructuringHandler(
          source,
          config,
          helperIdentifier,
          node.left.properties
        );
        return asStatementReturnTypeWithIdentifier(
          [
            blockStatement([
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
            ]),
          ],
          [],
          helperIdentifier
        );
      }
    });
  };
