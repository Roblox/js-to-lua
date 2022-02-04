import {
  ArrowFunctionExpression,
  Declaration,
  Expression,
  FunctionDeclaration,
  FunctionExpression,
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
  EmptyConfig,
  forwardHandlerRef,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { combineStatementHandlers } from '@js-to-lua/lua-conversion-utils';
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
  nodeGroup,
  variableDeclaration,
  variableDeclaratorIdentifier,
} from '@js-to-lua/lua-types';
import { createFunctionBodyHandler } from '../expression/function-body.handler';
import {
  createFunctionParamsBodyHandler,
  createFunctionParamsHandler,
} from '../function-params.handler';
import { createAssignmentPatternHandlerFunction } from '../statement/assignment-pattern.handler';
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
  handleIdentifier: HandlerFunction<LuaLVal, LVal>,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    ObjectMethod | ObjectProperty
  >,
  handleTsTypes: BaseNodeHandler<LuaType, TSType>,
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
      forwardHandlerRef(() => handleTsTypes)
    ),
    createTsInterfaceHandler(
      handleIdentifier,
      handleExpression,
      typesHandler,
      forwardHandlerRef(() => handleTsTypes)
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
      forwardHandlerRef(() => handleTsTypes)
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
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Declaration
  >,
  handleLVal: HandlerFunction<LuaLVal, LVal>
) {
  const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
    handleExpression,
    handleIdentifier
  );
  const { typesHandler } = createTypeAnnotationHandler(
    handleExpression,
    handleIdentifier
  );
  const functionParamsHandler = createFunctionParamsHandler(
    handleIdentifier,
    typesHandler
  );

  return function (
    source: string,
    config: EmptyConfig,
    node: FunctionDeclaration | FunctionExpression | ArrowFunctionExpression,
    id: LuaIdentifier
  ): LuaFunctionDeclaration | LuaNodeGroup {
    const handleFunctionBody = createFunctionBodyHandler(
      handleStatement,
      handleExpressionAsStatement
    )(source, config);
    const handleParamsBody = createFunctionParamsBodyHandler(
      handleDeclaration,
      handleAssignmentPattern,
      handleLVal
    );

    return id.typeAnnotation
      ? nodeGroup([
          variableDeclaration([variableDeclaratorIdentifier(id)], []),
          functionDeclaration(
            { ...id, typeAnnotation: undefined },
            functionParamsHandler(source, config, node),
            nodeGroup([
              ...handleParamsBody(source, config, node),
              ...handleFunctionBody(node),
            ]),
            node.returnType
              ? typesHandler(source, config, node.returnType)
              : undefined,
            false
          ),
        ])
      : functionDeclaration(
          id,
          functionParamsHandler(source, config, node),
          nodeGroup([
            ...handleParamsBody(source, config, node),
            ...handleFunctionBody(node),
          ]),
          node.returnType
            ? typesHandler(source, config, node.returnType)
            : undefined
        );
  };
}
