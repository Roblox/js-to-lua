import {
  AssignmentPattern,
  ExportDefaultDeclaration,
  Expression,
  isIdentifier as isBabelIdentifier,
  LVal,
  Noop,
  ObjectProperty,
  Statement,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  AssignmentStatement,
  LuaDeclaration,
  LuaExpression,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaTableKeyField,
  LuaTypeAnnotation,
  tableExpressionKeyField,
  tableKeyField,
} from '@js-to-lua/lua-types';
import { IdentifierHandlerFunction } from './identifier-handler-types';
import { createObjectKeyExpressionHandler } from './object-key-expression.handler';
import { createObjectPropertyIdentifierHandler } from './object-property-identifier.handler';
import { createObjectPropertyValueHandler } from './object-property-value.handler';

export const createObjectPropertyHandler = (
  handleExpression: BaseNodeHandler<LuaExpression, Expression>,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleIdentifier: IdentifierHandlerFunction,
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Exclude<ExportDefaultDeclaration['declaration'], Expression>
  >,
  handleAssignmentPattern: HandlerFunction<
    AssignmentStatement,
    AssignmentPattern
  >,
  handleLVal: HandlerFunction<LuaLVal, LVal>,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >
) => {
  const handleObjectPropertyIdentifier =
    createObjectPropertyIdentifierHandler(handleIdentifier);
  const handleObjectPropertyValue = createObjectPropertyValueHandler(
    handleExpression,
    handleStatement,
    handleIdentifier,
    handleDeclaration,
    handleAssignmentPattern,
    handleLVal,
    handleTypeAnnotation
  );
  const handleObjectKeyExpression = createObjectKeyExpressionHandler(
    handleExpression.handler
  );
  return createHandler<LuaTableKeyField, ObjectProperty>(
    'ObjectProperty',
    (source, config, { key, value, computed }) => {
      if (isBabelIdentifier(key) && !computed) {
        return tableKeyField(
          computed,
          handleObjectPropertyIdentifier(source, config, key),
          handleObjectPropertyValue(source, config, value)
        );
      } else {
        return tableExpressionKeyField(
          handleObjectKeyExpression(source, config, key),
          handleObjectPropertyValue(source, config, value)
        );
      }
    }
  );
};
