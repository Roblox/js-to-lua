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
import { removeIdTypeAnnotation } from '@js-to-lua/lua-conversion-utils';
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
import {
  createFunctionParamsBodyHandler,
  createFunctionParamsHandler,
} from '../function-params.handler';
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
  const functionParamsHandler = createFunctionParamsHandler(
    handleIdentifier,
    handleTypeAnnotation,
    handleType
  );

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
    const handleParamsBody = createFunctionParamsBodyHandler(
      handleDeclaration,
      handleAssignmentPattern,
      handleLVal
    );

    const typeParameters =
      node.typeParameters && !isNoop(node.typeParameters)
        ? handleTypeParameterDeclaration(node.typeParameters)
        : undefined;

    const handleReturnType =
      createFunctionReturnTypeHandler(handleTypeAnnotation);
    const returnType = handleReturnType(source, config, node);

    return id.typeAnnotation
      ? nodeGroup([
          variableDeclaration([variableDeclaratorIdentifier(id)], []),
          functionDeclarationMultipleReturn(
            removeIdTypeAnnotation(id),
            functionParamsHandler(source, config, node),
            nodeGroup([
              ...handleParamsBody(source, config, node),
              ...handleFunctionBody(node),
            ]),
            returnType,
            false,
            typeParameters
          ),
        ])
      : functionDeclarationMultipleReturn(
          id,
          functionParamsHandler(source, config, node),
          nodeGroup([
            ...handleParamsBody(source, config, node),
            ...handleFunctionBody(node),
          ]),
          returnType,
          true,
          typeParameters
        );
  };
}
