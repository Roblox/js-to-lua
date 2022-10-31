import * as Babel from '@babel/types';
import {
  AsStatementHandlerFunction,
  createHandlerFunction,
  EmptyConfig,
  handleComments,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  selfIdentifier,
  typeReferenceWithoutDefaultType,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
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
  returnStatement,
  tableConstructor,
  typeAny,
  typeCastExpression,
  typeReference,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { isNonEmptyArray } from '@js-to-lua/shared-utils';
import { applyTo } from 'ramda';
import { createFunctionBodyHandler } from '../../../../expression/function-body.handler';
import { createFunctionParamsWithBodyHandler } from '../../../../function-params-with-body.handler';
import { createAssignmentPatternHandlerFunction } from '../../../../statement/assignment/assignment-pattern.handler';
import { createTypeParameterDeclarationHandler } from '../../../../type/type-parameter-declaration.handler';
import { createConstructorTsParameterPropHandler } from '../../class-constructor-ts-parameter.handler';
import {
  createClassIdentifierPrivate,
  hasNonPublicMembers,
  isClassConstructor,
} from '../../class-declaration.utils';
import { createNonStaticInitializedClassPropertiesGetter } from '../../non-static-initialized-class-properties.handler';

export const createConstructorHandlerFunction = (
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
    LuaFunctionDeclaration,
    Babel.ClassDeclaration,
    EmptyConfig & {
      classIdentifier: LuaIdentifier;
    }
  >(
    (source, config, node): LuaFunctionDeclaration => {
      const {
        handleParamsWithBody,
        functionBodyHandler,
        typeParameterDeclarationHandler,
        constructorTsParameterPropHandler,
        getNonStaticInitializedClassProperties,
      } = getHandlers();
      const handleConstructorTsParameterProp =
        constructorTsParameterPropHandler(source, config);

      const { classIdentifier } = config;
      const classBaseIdentifier = hasNonPublicMembers(node)
        ? createClassIdentifierPrivate(classIdentifier)
        : classIdentifier;

      const superClass = node.superClass
        ? handleExpression(source, config, node.superClass)
        : undefined;

      const defaultSelfDeclaration = applyTo(
        variableDeclaration(
          [variableDeclaratorIdentifier(selfIdentifier())],
          [
            variableDeclaratorValue(
              callExpression(identifier('setmetatable'), [
                tableConstructor(),
                classIdentifier,
              ])
            ),
          ]
        ),
        (declaration) =>
          superClass
            ? withTrailingConversionComment(
                declaration,
                `ROBLOX TODO: super constructor may be used`
              )
            : declaration
      );

      const constructorMethod = node.body.body.find(isClassConstructor);

      const nonStaticPropertiesConstructorInitializers =
        getNonStaticInitializedClassProperties(source, config, node);

      const genericTypeParametersDeclaration =
        node.typeParameters &&
        !Babel.isNoop(node.typeParameters) &&
        node.typeParameters.params.length
          ? typeParameterDeclarationHandler(source, config, node.typeParameters)
          : undefined;

      const genericTypeParameters = genericTypeParametersDeclaration
        ? applyTo(
            genericTypeParametersDeclaration.params.map(
              typeReferenceWithoutDefaultType
            ),
            (params) => (isNonEmptyArray(params) ? params : undefined)
          )
        : undefined;
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
                  identifier(`${classBaseIdentifier.name}.new`),
                  [...paramsResponse.params],
                  nodeGroup([
                    defaultSelfDeclaration,
                    ...paramsResponse.body,
                    ...constructorMethod.params
                      .filter((n): n is Babel.TSParameterProperty =>
                        Babel.isTSParameterProperty(n)
                      )
                      .map(handleConstructorTsParameterProp),
                    ...nonStaticPropertiesConstructorInitializers,
                    ...functionBodyHandler(source, config, constructorMethod),
                    returnStatement(
                      typeCastExpression(
                        typeCastExpression(selfIdentifier(), typeAny()),
                        typeReference(classIdentifier, genericTypeParameters)
                      )
                    ),
                  ]),
                  typeReference(classIdentifier, genericTypeParameters),
                  false,
                  genericTypeParametersDeclaration
                )
              )
          )
        : functionDeclaration(
            identifier(`${classBaseIdentifier.name}.new`),
            [],
            nodeGroup([
              defaultSelfDeclaration,
              ...nonStaticPropertiesConstructorInitializers,
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(classIdentifier, genericTypeParameters)
                )
              ),
            ]),
            typeReference(classIdentifier, genericTypeParameters),
            false,
            genericTypeParametersDeclaration
          );
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
      functionBodyHandler: createFunctionBodyHandler(
        handleStatement,
        handleExpressionAsStatement
      ),
      typeParameterDeclarationHandler:
        createTypeParameterDeclarationHandler(handleType).handler,
      constructorTsParameterPropHandler:
        createConstructorTsParameterPropHandler(handleIdentifier),
      getNonStaticInitializedClassProperties:
        createNonStaticInitializedClassPropertiesGetter(handleExpression),
    };
  }
};
