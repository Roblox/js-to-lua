import {
  ArrowFunctionExpression,
  Declaration,
  Expression,
  FunctionDeclaration,
  FunctionExpression,
  isNoop,
  LVal,
  Statement,
} from '@babel/types';
import {
  AsStatementHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  removeIdTypeAnnotation,
  unwrapNestedNodeGroups,
} from '@js-to-lua/lua-conversion-utils';
import {
  functionDeclarationMultipleReturn,
  LuaDeclaration,
  LuaExpression,
  LuaFunctionDeclaration,
  LuaIdentifier,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  nodeGroup,
  variableDeclaration,
  variableDeclaratorIdentifier,
} from '@js-to-lua/lua-types';
import { createFunctionBodyHandler } from '../expression/function-body.handler';
import { createFunctionParamsWithBodyHandler } from '../function-params-with-body.handler';
import { createFunctionReturnTypeHandler } from '../function-return-type.handler';
import { createAssignmentPatternHandlerFunction } from '../statement/assignment/assignment-pattern.handler';
import { createTypeAnnotationHandler } from '../type/type-annotation.handler';
import { createTypeParameterDeclarationHandler } from '../type/type-parameter-declaration.handler';

export function createConvertToFunctionDeclarationHandler(
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
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
  const {
    handleTypeAnnotation,
    handleType: { handler: handleType },
  } = createTypeAnnotationHandler(handleExpression, handleIdentifier);

  return function (
    source: string,
    config: EmptyConfig,
    node: FunctionDeclaration | FunctionExpression | ArrowFunctionExpression,
    id: LuaIdentifier
  ): LuaFunctionDeclaration | LuaNodeGroup {
    const handleTypeParameterDeclaration =
      createTypeParameterDeclarationHandler(handleType).handler(source, config);

    const handleFunctionBody = createFunctionBodyHandler(
      handleStatement,
      handleExpressionAsStatement
    )(source, config);
    const handleParamsWithBody = createFunctionParamsWithBodyHandler(
      handleIdentifier,
      handleDeclaration,
      handleAssignmentPattern,
      handleLVal,
      handleTypeAnnotation,
      handleType
    );

    const typeParameters =
      node.typeParameters && !isNoop(node.typeParameters)
        ? handleTypeParameterDeclaration(node.typeParameters)
        : undefined;

    const handleReturnType =
      createFunctionReturnTypeHandler(handleTypeAnnotation);
    const returnType = handleReturnType(source, config, node);

    const { params: functionParams, body: paramsBody } = handleParamsWithBody(
      source,
      config,
      node
    );

    const functionBody = unwrapNestedNodeGroups(
      nodeGroup([...paramsBody, ...handleFunctionBody(node)])
    );
    return id.typeAnnotation
      ? nodeGroup([
          variableDeclaration([variableDeclaratorIdentifier(id)], []),
          functionDeclarationMultipleReturn(
            removeIdTypeAnnotation(id),
            functionParams,
            functionBody,
            returnType,
            false,
            typeParameters
          ),
        ])
      : functionDeclarationMultipleReturn(
          id,
          functionParams,
          functionBody,
          returnType,
          true,
          typeParameters
        );
  };
}
