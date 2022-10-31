import * as Babel from '@babel/types';
import {
  AsStatementHandlerFunction,
  createHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  functionDeclarationMultipleReturn,
  identifier,
  isIdentifier,
  LuaDeclaration,
  LuaExpression,
  LuaIdentifier,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaType,
  LuaTypeAnnotation,
  nodeGroup,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import { applyTo } from 'ramda';
import { createFunctionBodyHandler } from '../../../../expression/function-body.handler';
import { createFunctionParamsWithBodyHandler } from '../../../../function-params-with-body.handler';
import { createFunctionReturnTypeHandler } from '../../../../function-return-type.handler';
import { createAssignmentPatternHandlerFunction } from '../../../../statement/assignment/assignment-pattern.handler';
import {
  createClassIdentifierPrivate,
  hasNonPublicMembers,
} from '../../class-declaration.utils';
import { createClassMethodsHandlerFunction } from '../class-declaration-methods.handler';

export const createDefaultClassMethodsHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Babel.Expression
  >,
  handleIdentifier: HandlerFunction<LuaLVal, Babel.LVal>,
  handleStatement: HandlerFunction<LuaStatement, Babel.Statement>,
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Babel.Declaration
  >,
  handleLVal: HandlerFunction<LuaLVal, Babel.LVal>,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    Babel.TypeAnnotation | Babel.TSTypeAnnotation | Babel.Noop
  >,
  handleType: HandlerFunction<LuaType, Babel.FlowType | Babel.TSType>
) => {
  const defaultClassMethodHandler = createDefaultClassMethodHandler();
  const classMethodsHandler = createClassMethodsHandlerFunction(
    defaultClassMethodHandler
  );

  return createHandlerFunction<
    LuaNodeGroup,
    Babel.ClassDeclaration,
    EmptyConfig & { classIdentifier: LuaIdentifier }
  >(
    (source, config, node) => {
      const classBaseIdentifier = hasNonPublicMembers(node)
        ? createClassIdentifierPrivate(config.classIdentifier)
        : config.classIdentifier;

      return classMethodsHandler(
        source,
        { ...config, classBaseIdentifier },
        node
      );
    },
    { skipComments: true }
  );

  function createDefaultClassMethodHandler() {
    const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
      handleExpression,
      handleIdentifier
    );

    const handleParamsWithBody = createFunctionParamsWithBodyHandler(
      handleIdentifier,
      handleDeclaration,
      handleAssignmentPattern,
      handleLVal,
      handleTypeAnnotation,
      handleType
    );

    const functionBodyHandler = createFunctionBodyHandler(
      handleStatement,
      handleExpressionAsStatement
    );

    return createHandlerFunction<
      LuaStatement,
      Babel.ClassMethod | Babel.ClassPrivateMethod | Babel.TSDeclareMethod,
      EmptyConfig & { classBaseIdentifier: LuaIdentifier }
    >(
      (source, config, node) => {
        if (Babel.isPrivateName(node.key)) {
          return withTrailingConversionComment(
            unhandledStatement(),
            `ROBLOX comment: unhandled class body node type ${node.key.type}`,
            getNodeSource(source, node)
          );
        }
        const id = handleExpression(source, config, node.key);

        const handleReturnType =
          createFunctionReturnTypeHandler(handleTypeAnnotation);
        const returnType = handleReturnType(source, config, node);

        return Babel.isIdentifier(node.key) && isIdentifier(id)
          ? applyTo(
              handleParamsWithBody(
                source,
                {
                  assignedTo: undefined,
                  noShadowIdentifiers: undefined,
                  ...config,
                },
                node
              ),
              (paramsResponse) =>
                functionDeclarationMultipleReturn(
                  identifier(
                    `${config.classBaseIdentifier.name}${
                      node.static ? '.' : ':'
                    }${id.name}`
                  ),
                  [...paramsResponse.params],
                  nodeGroup([
                    ...paramsResponse.body,
                    ...functionBodyHandler(source, config, node),
                  ]),
                  returnType,
                  false
                )
            )
          : withTrailingConversionComment(
              unhandledStatement(),
              `ROBLOX comment: unhandled key type ${node.key.type}`,
              getNodeSource(source, node.key)
            );
      },
      { skipComments: true }
    );
  }
};
