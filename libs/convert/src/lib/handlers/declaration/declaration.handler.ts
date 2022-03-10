import {
  Declaration,
  Expression,
  FlowType,
  Identifier,
  LVal,
  ObjectMethod,
  ObjectProperty,
  PatternLike,
  Statement,
  TSType,
} from '@babel/types';
import {
  BaseNodeHandler,
  forwardHandlerRef,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { combineStatementHandlers } from '@js-to-lua/lua-conversion-utils';
import {
  LuaDeclaration,
  LuaExpression,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaTableKeyField,
  LuaType,
} from '@js-to-lua/lua-types';
import { createExportHandler } from '../statement/export';
import { createImportHandler } from '../statement/import';
import { createTsTypeAnnotationHandler } from '../type/ts-type-annotation.handler';
import { createTypeAnnotationHandler } from '../type/type-annotation.handler';
import { createClassDeclarationHandler } from './class-declaration.handler';
import { createFunctionDeclarationHandler } from './function-declaration.handler';
import { createTsEnumHandler } from './ts-enum-declaration.handler';
import { createTsInterfaceHandler } from './ts-interface-declaration.handler';
import { createTypeAliasDeclarationHandler } from './type-alias-declaration.handler';
import { createVariableDeclarationHandler } from './variable-declaration.handler';

export const createDeclarationHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleExpressionAsStatement: HandlerFunction<
    LuaExpression | LuaStatement,
    Expression
  >,
  handleIdentifier: HandlerFunction<LuaLVal, LVal>,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    ObjectMethod | ObjectProperty
  >,
  handleTypes: BaseNodeHandler<LuaType, TSType | FlowType>,
  objectPropertyIdentifierHandlerFunction: HandlerFunction<
    LuaExpression,
    Identifier
  >,
  objectKeyExpressionHandlerFunction: HandlerFunction<
    LuaExpression,
    Expression
  >,
  objectPropertyValueHandlerFunction: HandlerFunction<
    LuaExpression,
    Expression | PatternLike
  >,
  handleLVal: HandlerFunction<LuaLVal, LVal>
): BaseNodeHandler<LuaNodeGroup | LuaDeclaration, Declaration> => {
  const { typesHandler } = createTypeAnnotationHandler(
    handleExpression,
    handleIdentifier
  );

  const declarationHandler: BaseNodeHandler<
    LuaNodeGroup | LuaDeclaration,
    Declaration
  > = combineStatementHandlers<LuaDeclaration | LuaNodeGroup, Declaration>([
    createVariableDeclarationHandler(
      handleExpression,
      handleExpressionAsStatement,
      handleIdentifier,
      handleStatement,
      handleObjectField,
      forwardHandlerRef(() => declarationHandler)
    ),
    createFunctionDeclarationHandler(
      handleIdentifier,
      handleStatement,
      handleExpression,
      handleExpressionAsStatement,
      forwardHandlerRef(() => declarationHandler),
      handleLVal
    ),
    createTypeAliasDeclarationHandler(
      handleIdentifier,
      forwardHandlerRef(() => handleTypes)
    ),
    createTsInterfaceHandler(
      handleIdentifier,
      handleExpression,
      typesHandler,
      forwardHandlerRef(() => handleTypes)
    ),
    createTsEnumHandler(
      handleIdentifier,
      objectPropertyIdentifierHandlerFunction,
      objectKeyExpressionHandlerFunction,
      objectPropertyValueHandlerFunction
    ),
    createExportHandler(
      forwardHandlerRef(() => declarationHandler),
      handleExpression,
      handleIdentifier
    ),
    createImportHandler(handleExpression, handleIdentifier),
    createClassDeclarationHandler(
      handleExpression,
      handleExpressionAsStatement,
      handleIdentifier,
      handleStatement,
      forwardHandlerRef(() => declarationHandler),
      handleLVal,
      forwardHandlerRef(() => handleTypes)
    ),
  ]);

  return declarationHandler;
};
