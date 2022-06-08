import {
  AssignmentPattern,
  ExportDefaultDeclaration,
  Expression,
  FlowType,
  LVal,
  Noop,
  Statement,
  TSType,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';
import {
  BaseNodeHandler,
  combineHandlers,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { defaultExpressionHandler } from '@js-to-lua/lua-conversion-utils';
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
} from '@js-to-lua/lua-types';
import { IdentifierHandlerFunction } from '../identifier-handler-types';
import { NoSpreadObjectProperty } from './object-expression.types';
import { createObjectMethodHandler } from './object-method.handler';
import { createObjectPropertyHandler } from './object-property.handler';

export const createObjectFieldHandler = (
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
  const handleObjectProperty = createObjectPropertyHandler(
    expressionHandler,
    handleStatement,
    handleIdentifier,
    handleDeclaration,
    handleAssignmentPattern,
    handleLVal,
    handleTypeAnnotation,
    handleType
  );
  const handleObjectMethod = createObjectMethodHandler(
    expressionHandler,
    handleStatement,
    handleIdentifier,
    handleDeclaration,
    handleAssignmentPattern,
    handleLVal,
    handleTypeAnnotation,
    handleType
  );

  return combineHandlers<LuaTableKeyField, NoSpreadObjectProperty>(
    [handleObjectProperty, handleObjectMethod],
    defaultExpressionHandler
  );
};
