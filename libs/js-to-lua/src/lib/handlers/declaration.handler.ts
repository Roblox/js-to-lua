import {
  ArrowFunctionExpression,
  AssignmentPattern,
  Declaration,
  Expression,
  FunctionDeclaration,
  FunctionExpression,
  isAssignmentPattern,
  LVal,
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
  LuaType,
  returnStatement,
} from '@js-to-lua/lua-types';
import { BaseNodeHandler, EmptyConfig, HandlerFunction } from '../types';
import { combineStatementHandlers } from '../utils/combine-handlers';
import { forwardHandlerRef } from '../utils/forward-handler-ref';
import { createFunctionDeclarationHandler } from './function-declaration.handler';
import { createFunctionParamsHandler } from './function-params.handler';
import { createAssignmentPatternHandlerFunction } from './statement/assignment-pattern.handler';
import { createExportHandler } from './statement/export';
import { createImportHandler } from './statement/import';
import { createTypeAliasDeclarationHandler } from './type-alias-declaration.handler';
import { createTypeAnnotationHandler } from './type-annotation.handler';
import { createVariableDeclarationHandler } from './variable-declaration.handler';

export const createDeclarationHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaLVal, LVal>,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleTsTypes: BaseNodeHandler<LuaType, TSType, EmptyConfig>
): BaseNodeHandler<LuaNodeGroup | LuaDeclaration, Declaration> => {
  const declarationHandler: BaseNodeHandler<
    LuaNodeGroup | LuaDeclaration,
    Declaration,
    EmptyConfig
  > = combineStatementHandlers<LuaDeclaration | LuaNodeGroup, Declaration>([
    createVariableDeclarationHandler(
      handleExpression,
      handleIdentifier,
      handleStatement
    ),
    createFunctionDeclarationHandler(
      handleIdentifier,
      handleStatement,
      handleExpression
    ),
    createTypeAliasDeclarationHandler(
      handleIdentifier,
      forwardHandlerRef(() => handleTsTypes)
    ),
    createExportHandler(
      forwardHandlerRef(() => declarationHandler),
      handleExpression,
      handleIdentifier
    ),
    createImportHandler(handleExpression, handleIdentifier),
  ]);

  return declarationHandler;
};

export function createConvertToFunctionDeclarationHandler(
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaLVal, LVal>
) {
  const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
    handleExpression,
    handleIdentifier
  );
  const { typesHandler } = createTypeAnnotationHandler(handleExpression);
  const functionParamsHandler = createFunctionParamsHandler(handleIdentifier)
    .handler;

  return function (
    source: string,
    config: EmptyConfig,
    node: FunctionDeclaration | FunctionExpression | ArrowFunctionExpression,
    identifier: LuaIdentifier
  ): LuaFunctionDeclaration {
    const body: LuaStatement[] =
      node.body.type === 'BlockStatement'
        ? node.body.body.map(handleStatement(source, config))
        : [returnStatement(handleExpression(source, config, node.body))];

    return functionDeclaration(
      identifier,
      node.params.map(functionParamsHandler(source, config)),
      [
        ...node.params
          .filter((param) => isAssignmentPattern(param))
          .map((param) =>
            handleAssignmentPattern(source, config, param as AssignmentPattern)
          ),
        ...body,
      ],
      node.returnType
        ? typesHandler(source, config, node.returnType)
        : undefined
    );
  };
}
