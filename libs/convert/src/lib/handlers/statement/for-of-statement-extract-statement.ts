import * as Babel from '@babel/types';
import { EmptyConfig, HandlerFunction } from '@js-to-lua/handler-utils';
import { generateUniqueIdentifier } from '@js-to-lua/lua-conversion-utils';
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
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>,
  handleStatement: HandlerFunction<LuaStatement, Babel.Statement>,
  handleLVal: HandlerFunction<LuaLVal, Babel.LVal>,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    Babel.ObjectMethod | Babel.ObjectProperty
  >
) => {
  return (
    source: string,
    config: EmptyConfig,
    left: Babel.LVal,
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

    if (Babel.isIdentifier(left)) {
      return {
        identifier: refIdentifier,
        statement: assignmentOrDeclaration(
          [handleIdentifierStrict(source, config, left)],
          [refIdentifier]
        ),
      };
    } else if (Babel.isObjectPattern(left)) {
      if (
        hasUnhandledObjectDestructuringParam(
          left.properties.filter((property) =>
            Babel.isObjectProperty(property)
          ) as Babel.ObjectProperty[]
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
    } else if (Babel.isArrayPattern(left)) {
      const elements = left.elements.map((x) => x || Babel.arrayPattern([]));
      const arrayPatternDestructuringHandler =
        createArrayPatternDestructuringHandler(handleExpression);
      if (hasUnhandledArrayDestructuringParam(left.elements.filter(isTruthy))) {
        return null;
      }
      const destructured = arrayPatternDestructuringHandler(
        source,
        config,
        elements,
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
