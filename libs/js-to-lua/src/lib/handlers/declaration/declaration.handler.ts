import {
  ArrowFunctionExpression,
  Declaration,
  Expression,
  FunctionDeclaration,
  FunctionExpression,
  LVal,
  ObjectMethod,
  ObjectProperty,
  Statement,
  TSType,
} from '@babel/types';
import {
  functionDeclaration,
  LuaDeclaration,
  LuaExpression,
  LuaFunctionDeclaration,
  LuaIdentifier,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaTableKeyField,
  LuaType,
} from '@js-to-lua/lua-types';
import { BaseNodeHandler, EmptyConfig, HandlerFunction } from '../../types';
import { combineStatementHandlers } from '../../utils/combine-handlers';
import { forwardHandlerRef } from '../../utils/forward-handler-ref';
import { createFunctionDeclarationHandler } from './function-declaration.handler';
import {
  createFunctionParamsBodyHandler,
  createFunctionParamsHandler,
} from '../function-params.handler';
import { createAssignmentPatternHandlerFunction } from '../statement/assignment-pattern.handler';
import { createExportHandler } from '../statement/export';
import { createImportHandler } from '../statement/import';
import { createTypeAliasDeclarationHandler } from './type-alias-declaration.handler';
import { createTypeAnnotationHandler } from '../type/type-annotation.handler';
import { createVariableDeclarationHandler } from './variable-declaration.handler';
import { createFunctionBodyHandler } from '../expression/function-body.handler';
import { createClassDeclarationHandler } from './class-declaration.handler';
import { createTsInterfaceHandler } from './ts-interface-declaration.handler';

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
  handleTsTypes: BaseNodeHandler<LuaType, TSType>
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
      forwardHandlerRef(() => declarationHandler)
    ),
    createTypeAliasDeclarationHandler(
      handleIdentifier,
      forwardHandlerRef(() => handleTsTypes)
    ),
    createTsInterfaceHandler(
      handleIdentifier,
      handleExpression,
      typesHandler,
      forwardHandlerRef(() => handleTsTypes)
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
      forwardHandlerRef(() => declarationHandler)
    ),
  ]);

  return declarationHandler;
};

export function createConvertToFunctionDeclarationHandler(
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleExpressionAsStatement: HandlerFunction<
    LuaExpression | LuaStatement,
    Expression
  >,
  handleIdentifier: HandlerFunction<LuaLVal, LVal>,
  handleDeclaration: HandlerFunction<LuaNodeGroup | LuaDeclaration, Declaration>
) {
  const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
    handleExpression,
    handleIdentifier
  );
  const { typesHandler } = createTypeAnnotationHandler(
    handleExpression,
    handleIdentifier
  );
  const functionParamsHandler = createFunctionParamsHandler(handleIdentifier);

  return function (
    source: string,
    config: EmptyConfig,
    node: FunctionDeclaration | FunctionExpression | ArrowFunctionExpression,
    id: LuaIdentifier
  ): LuaFunctionDeclaration {
    const handleFunctionBody = createFunctionBodyHandler(
      handleStatement,
      handleExpressionAsStatement
    )(source, config);
    const handleParamsBody = createFunctionParamsBodyHandler(
      handleDeclaration,
      handleAssignmentPattern
    );

    return functionDeclaration(
      id,
      functionParamsHandler(source, config, node),
      [...handleParamsBody(source, config, node), ...handleFunctionBody(node)],
      node.returnType
        ? typesHandler(source, config, node.returnType)
        : undefined
    );
  };
}
