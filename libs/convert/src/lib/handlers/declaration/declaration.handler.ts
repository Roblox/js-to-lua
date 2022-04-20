import {
  Declaration,
  Expression,
  Identifier,
  LVal,
  ObjectMethod,
  ObjectProperty,
  PatternLike,
  Statement,
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
} from '@js-to-lua/lua-types';
import {
  IdentifierHandlerFunction,
  IdentifierStrictHandlerFunction,
} from '../expression/identifier-handler-types';
import { createExportHandler } from '../statement/export';
import { createImportHandler } from '../statement/import';
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
  handleIdentifier: IdentifierHandlerFunction,
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    ObjectMethod | ObjectProperty
  >,
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
  const { handleTypeAnnotation, handleType } = createTypeAnnotationHandler(
    handleExpression,
    handleIdentifierStrict
  );

  const declarationHandler: BaseNodeHandler<
    LuaNodeGroup | LuaDeclaration,
    Declaration
  > = combineStatementHandlers<LuaDeclaration | LuaNodeGroup, Declaration>([
    createVariableDeclarationHandler(
      handleExpression,
      handleExpressionAsStatement,
      handleIdentifier,
      handleIdentifierStrict,
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
    createTypeAliasDeclarationHandler(handleIdentifier, handleType.handler),
    createTsInterfaceHandler(
      handleIdentifier,
      handleExpression,
      handleTypeAnnotation,
      handleType.handler
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
      handleTypeAnnotation,
      handleType.handler
    ),
  ]);

  return declarationHandler;
};
