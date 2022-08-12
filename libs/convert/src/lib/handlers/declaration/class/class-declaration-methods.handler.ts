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
import { createFunctionBodyHandler } from '../../expression/function-body.handler';
import { createFunctionParamsBodyHandler } from '../../function-params-body.handler';
import { createFunctionParamsHandler } from '../../function-params.handler';
import { createFunctionReturnTypeHandler } from '../../function-return-type.handler';
import { createAssignmentPatternHandlerFunction } from '../../statement/assignment/assignment-pattern.handler';
import {
  isAnyClassMethod,
  isAnyClassProperty,
  isClassConstructor,
} from './class-declaration.utils';

export const createClassMethodsHandlerFunction = (
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
  return createHandlerFunction<
    LuaNodeGroup,
    Babel.ClassDeclaration,
    EmptyConfig & { classIdentifier: LuaIdentifier }
  >(
    (source, config, node) => {
      const { classIdentifier } = config;

      const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
        handleExpression,
        handleIdentifier
      );

      const functionParamsHandler = createFunctionParamsHandler(
        handleIdentifier,
        handleTypeAnnotation,
        handleType
      );

      const handleParamsBody = createFunctionParamsBodyHandler(
        handleDeclaration,
        handleAssignmentPattern,
        handleLVal
      );

      const functionBodyHandler = createFunctionBodyHandler(
        handleStatement,
        handleExpressionAsStatement
      );

      const bodyWithoutConstructor = node.body.body.filter(
        (n) => !isClassConstructor(n)
      );

      const classMethods = bodyWithoutConstructor
        .filter((n) => !isAnyClassProperty(n))
        .map((n) => {
          if (isAnyClassMethod(n)) {
            return handleClassMethod(n);
          } else {
            return withTrailingConversionComment(
              unhandledStatement(),
              `ROBLOX comment: unhandled class body node type ${n.type}`,
              getNodeSource(source, n)
            );
          }
        });

      return nodeGroup(classMethods);

      function handleClassMethod(
        node:
          | Babel.ClassMethod
          | Babel.ClassPrivateMethod
          | Babel.TSDeclareMethod
      ) {
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
          ? functionDeclarationMultipleReturn(
              identifier(
                `${classIdentifier.name}${node.static ? '.' : ':'}${id.name}`
              ),
              [
                ...functionParamsHandler(
                  source,
                  {
                    assignedTo: undefined,
                    noShadowIdentifiers: undefined,
                    ...config,
                  },
                  node
                ),
              ],
              nodeGroup([
                ...handleParamsBody(source, config, node),
                ...functionBodyHandler(source, config, node),
              ]),
              returnType,
              false
            )
          : withTrailingConversionComment(
              unhandledStatement(),
              `ROBLOX comment: unhandled key type ${node.key.type}`,
              getNodeSource(source, node.key)
            );
      }
    },
    { skipComments: true }
  );
};
