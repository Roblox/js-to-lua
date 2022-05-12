import {
  AssignmentPattern,
  ExportDefaultDeclaration,
  Expression,
  FlowType,
  isIdentifier as isBabelIdentifier,
  LVal,
  Noop,
  ObjectProperty,
  Statement,
  TSType,
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
  LuaType,
  LuaTypeAnnotation,
  tableExpressionKeyField,
  tableKeyField,
} from '@js-to-lua/lua-types';
import { IdentifierHandlerFunction } from './identifier-handler-types';
import { createObjectKeyExpressionHandler } from './object-key-expression.handler';
import { createObjectPropertyIdentifierHandler } from './object-property-identifier.handler';
import { createObjectPropertyValueHandler } from './object-property-value.handler';

export const createObjectPropertyHandler = (
  expressionHandler: BaseNodeHandler<LuaExpression, Expression>,
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
  >,
  handleType: HandlerFunction<LuaType, FlowType | TSType>
) => {
  const handleObjectPropertyIdentifier =
    createObjectPropertyIdentifierHandler(handleIdentifier);
  const handleObjectPropertyValue = createObjectPropertyValueHandler(
    expressionHandler,
    handleStatement,
    handleIdentifier,
    handleDeclaration,
    handleAssignmentPattern,
    handleLVal,
    handleTypeAnnotation,
    handleType
  );
  const handleObjectKeyExpression = createObjectKeyExpressionHandler(
    expressionHandler.handler
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
