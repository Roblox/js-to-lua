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
  BaseNodeAsStatementHandler,
  BaseNodeHandler,
  combineAsStatementHandlers,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { defaultExpressionAsStatementHandler } from '@js-to-lua/lua-conversion-utils';
import {
  AssignmentStatement,
  LuaDeclaration,
  LuaExpression,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaTableConstructor,
  LuaTableKeyField,
  LuaType,
  LuaTypeAnnotation,
} from '@js-to-lua/lua-types';
import { IdentifierHandlerFunction } from '../../identifier-handler-types';
import { NoSpreadObjectProperty } from '../object-expression.types';
import { createObjectMethodAsStatementHandler } from './object-method-as-statement.handler';
import { createObjectPropertyAsStatementHandler } from './object-property-as-statement.handler';

export const createObjectFieldAsStatementHandler = (
  expressionHandler: BaseNodeHandler<LuaExpression, Expression>,
  expressionAsStatementHandler: BaseNodeAsStatementHandler<
    LuaStatement,
    Expression
  >,
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
  const handleObjectPropertyAsStatement =
    createObjectPropertyAsStatementHandler(
      expressionHandler,
      expressionAsStatementHandler,
      handleStatement,
      handleIdentifier,
      handleDeclaration,
      handleAssignmentPattern,
      handleLVal,
      handleTypeAnnotation,
      handleType
    );
  const handleObjectMethodAsStatement = createObjectMethodAsStatementHandler(
    expressionHandler,
    handleStatement,
    handleIdentifier,
    handleDeclaration,
    handleAssignmentPattern,
    handleLVal,
    handleTypeAnnotation,
    handleType
  );

  return combineAsStatementHandlers<
    LuaStatement,
    NoSpreadObjectProperty,
    LuaTableConstructor<[LuaTableKeyField]>
  >(
    [handleObjectPropertyAsStatement, handleObjectMethodAsStatement],
    defaultExpressionAsStatementHandler
  );
};
