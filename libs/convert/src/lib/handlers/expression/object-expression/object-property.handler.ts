import * as Babel from '@babel/types';
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
import { IdentifierHandlerFunction } from '../identifier-handler-types';
import { createObjectKeyExpressionHandler } from './object-key-expression.handler';
import { createObjectPropertyIdentifierHandler } from './object-property-identifier.handler';
import { createObjectPropertyValueHandler } from './object-property-value.handler';

export const createObjectPropertyHandler = (
  expressionHandler: BaseNodeHandler<LuaExpression, Babel.Expression>,
  handleStatement: HandlerFunction<LuaStatement, Babel.Statement>,
  handleIdentifier: IdentifierHandlerFunction,
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Exclude<Babel.ExportDefaultDeclaration['declaration'], Babel.Expression>
  >,
  handleAssignmentPattern: HandlerFunction<
    AssignmentStatement,
    Babel.AssignmentPattern
  >,
  handleLVal: HandlerFunction<LuaLVal, Babel.LVal>,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    Babel.TypeAnnotation | Babel.TSTypeAnnotation | Babel.Noop
  >,
  handleType: HandlerFunction<LuaType, Babel.FlowType | Babel.TSType>
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
  return createHandler<LuaTableKeyField, Babel.ObjectProperty>(
    'ObjectProperty',
    (source, config, { key, value, computed }) => {
      const propertyValue = handleObjectPropertyValue(source, config, value);
      if (Babel.isIdentifier(key) && !computed) {
        return tableKeyField(
          computed,
          handleObjectPropertyIdentifier(source, config, key),
          propertyValue
        );
      } else {
        return tableExpressionKeyField(
          handleObjectKeyExpression(source, config, key),
          propertyValue
        );
      }
    }
  );
};
