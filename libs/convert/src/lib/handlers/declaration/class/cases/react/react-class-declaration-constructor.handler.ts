import * as Babel from '@babel/types';
import {
  AsStatementHandlerFunction,
  createHandlerFunction,
  EmptyConfig,
  handleComments,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  functionDeclaration,
  identifier,
  LuaDeclaration,
  LuaExpression,
  LuaFunctionDeclaration,
  LuaIdentifier,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaType,
  LuaTypeAnnotation,
  nodeGroup,
  typeAnnotation,
  typeReference,
} from '@js-to-lua/lua-types';
import { applyTo } from 'ramda';
import { createReactFunctionBodyHandler } from '../../../../expression/react-function-body.handler';
import { createFunctionParamsWithBodyHandler } from '../../../../function-params-with-body.handler';
import { createAssignmentPatternHandlerFunction } from '../../../../statement/assignment/assignment-pattern.handler';
import { createConstructorTsParameterPropHandler } from '../../class-constructor-ts-parameter.handler';
import {
  createClassIdentifierPrivate,
  hasNonPublicMembers,
  isClassConstructor,
} from '../../class-declaration.utils';
import { createNonStaticInitializedClassPropertiesGetter } from '../../non-static-initialized-class-properties.handler';

export const createReactConstructorHandlerFunction = (
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
    LuaFunctionDeclaration | LuaNodeGroup,
    Babel.ClassDeclaration,
    EmptyConfig & {
      classIdentifier: LuaIdentifier;
    }
  >(
    (source, config, node): LuaFunctionDeclaration | LuaNodeGroup => {
      const {
        handleParamsWithBody,
        functionBodyHandler,
        constructorTsParameterPropHandler,
        getNonStaticInitializedClassProperties,
      } = getHandlers();
      const handleConstructorTsParameterProp =
        constructorTsParameterPropHandler(source, config);

      const { classIdentifier } = config;
      const classBaseIdentifier = hasNonPublicMembers(node)
        ? createClassIdentifierPrivate(classIdentifier)
        : classIdentifier;

      const constructorMethod = node.body.body.find(isClassConstructor);

      const nonStaticPropertiesConstructorInitializers =
        getNonStaticInitializedClassProperties(source, config, node);

      return constructorMethod
        ? applyTo(
            handleParamsWithBody(
              source,
              {
                assignedTo: undefined,
                noShadowIdentifiers: undefined,
                ...config,
              },
              constructorMethod
            ),
            (paramsResponse) =>
              handleComments(
                source,
                constructorMethod,
                functionDeclaration(
                  identifier(`${classBaseIdentifier.name}.init`),
                  [
                    identifier(
                      'self',
                      typeAnnotation(typeReference(classBaseIdentifier))
                    ),
                    ...paramsResponse.params,
                  ],
                  nodeGroup([
                    ...paramsResponse.body,
                    ...constructorMethod.params
                      .filter((n): n is Babel.TSParameterProperty =>
                        Babel.isTSParameterProperty(n)
                      )
                      .map(handleConstructorTsParameterProp),
                    ...nonStaticPropertiesConstructorInitializers,
                    ...functionBodyHandler(source, config, constructorMethod),
                  ]),
                  undefined,
                  false
                )
              )
          )
        : nonStaticPropertiesConstructorInitializers.length
        ? functionDeclaration(
            identifier(`${classBaseIdentifier.name}.init`),
            [
              identifier(
                'self',
                typeAnnotation(typeReference(classBaseIdentifier))
              ),
            ],
            nodeGroup([...nonStaticPropertiesConstructorInitializers]),
            undefined,
            false
          )
        : nodeGroup([]);
    },
    { skipComments: true }
  );

  function getHandlers() {
    const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
      handleExpression,
      handleIdentifier
    );

    return {
      handleParamsWithBody: createFunctionParamsWithBodyHandler(
        handleIdentifier,
        handleDeclaration,
        handleAssignmentPattern,
        handleLVal,
        handleTypeAnnotation,
        handleType
      ),
      functionBodyHandler: createReactFunctionBodyHandler(
        handleStatement,
        handleExpressionAsStatement
      ),
      constructorTsParameterPropHandler:
        createConstructorTsParameterPropHandler(handleIdentifier),
      getNonStaticInitializedClassProperties:
        createNonStaticInitializedClassPropertiesGetter(handleExpression),
    };
  }
};
