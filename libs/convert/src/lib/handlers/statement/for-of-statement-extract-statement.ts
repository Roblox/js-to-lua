import {
  Expression,
  isArrayPattern as isBabelArrayPattern,
  isIdentifier as isBabelIdentifier,
  isObjectPattern as isBabelObjectPattern,
  isObjectProperty,
  LVal,
  ObjectMethod,
  ObjectProperty,
  Statement,
} from '@babel/types';
import { EmptyConfig, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  identifier,
  LuaExpression,
  LuaIdentifier,
  LuaLVal,
  LuaStatement,
  LuaTableKeyField,
  nodeGroup,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { IdentifierStrictHandlerFunction } from '../expression/identifier-handler-types';
import { generateUniqueIdentifier } from '../generate-unique-identifier';
import {
  createArrayPatternDestructuringHandler,
  hasUnhandledArrayDestructuringParam,
} from '../pattern/array-pattern-destructuring.handler';
import {
  createObjectPatternDestructuringHandler,
  hasUnhandledObjectDestructuringParam,
} from '../pattern/object-pattern-destructuring.handler';

export const createExtractForOfAssignmentStatement = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleLVal: HandlerFunction<LuaLVal, LVal>,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    ObjectMethod | ObjectProperty
  >
) => {
  return (
    source: string,
    config: EmptyConfig,
    left: LVal,
    isDeclaration = false
  ): {
    identifier: LuaIdentifier;
    statement: LuaStatement;
  } | null => {
    const refIdentifier = identifier(generateUniqueIdentifier([], 'ref'));

    const assignmentOrDeclaration = (
      identifiers: LuaIdentifier[],
      values: LuaExpression[]
    ) =>
      isDeclaration
        ? variableDeclaration(
            identifiers.map(variableDeclaratorIdentifier),
            values.map(variableDeclaratorValue)
          )
        : assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            identifiers,
            values
          );

    if (isBabelIdentifier(left)) {
      return {
        identifier: refIdentifier,
        statement: assignmentOrDeclaration(
          [handleIdentifierStrict(source, config, left)],
          [refIdentifier]
        ),
      };
    } else if (isBabelObjectPattern(left)) {
      if (
        hasUnhandledObjectDestructuringParam(
          left.properties.filter((property) =>
            isObjectProperty(property)
          ) as ObjectProperty[]
        )
      ) {
        return null;
      }

      const objectPatternDestructuringHandler =
        createObjectPatternDestructuringHandler(
          handleExpression,
          handleLVal,
          handleIdentifierStrict,
          handleObjectField
        );
      const destructured = objectPatternDestructuringHandler(
        source,
        config,
        refIdentifier,
        left.properties
      );
      return {
        identifier: refIdentifier,
        statement: assignmentOrDeclaration(
          destructured.ids,
          destructured.values.filter(isTruthy)
        ),
      };
    } else if (isBabelArrayPattern(left)) {
      const arrayPatternDestructuringHandler =
        createArrayPatternDestructuringHandler(handleExpression);
      if (hasUnhandledArrayDestructuringParam(left.elements.filter(isTruthy))) {
        return null;
      }
      const destructured = arrayPatternDestructuringHandler(
        source,
        config,
        left.elements.filter(isTruthy),
        refIdentifier
      ).map((item) =>
        assignmentOrDeclaration(
          item.ids.map((id) => handleLVal(source, config, id)),
          item.values.filter(isTruthy)
        )
      );
      return {
        identifier: refIdentifier,
        statement: nodeGroup(destructured),
      };
    }
    return null;
  };
};
