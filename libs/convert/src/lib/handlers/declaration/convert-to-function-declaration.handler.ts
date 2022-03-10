import {
  ArrowFunctionExpression,
  Declaration,
  Expression,
  FunctionDeclaration,
  FunctionExpression,
  isTSTypeParameterDeclaration,
  isTypeParameterDeclaration,
  LVal,
  Statement,
} from '@babel/types';
import { EmptyConfig, HandlerFunction } from '@js-to-lua/handler-utils';
import { defaultElementHandler } from '@js-to-lua/lua-conversion-utils';
import {
  functionDeclaration,
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
import { createAssignmentPatternHandlerFunction } from '../statement/assignment-pattern.handler';
import { createTsTypeParameterDeclarationHandler } from '../type/ts-type-parameter-declaration.handler';
import { createTypeAnnotationHandler } from '../type/type-annotation.handler';

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
    const handleTsTypeParameterDeclaration =
      createTsTypeParameterDeclarationHandler(typesHandler).handler(
        source,
        config
      );

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
      node.typeParameters && isTSTypeParameterDeclaration(node.typeParameters)
        ? handleTsTypeParameterDeclaration(node.typeParameters)
        : isTypeParameterDeclaration(node.typeParameters)
        ? defaultElementHandler(source, config, node.typeParameters)
        : undefined;

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
            false,
            typeParameters
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
            : undefined,
          true,
          typeParameters
        );
  };
}
