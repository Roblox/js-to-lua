import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  functionReturnType,
  identifier,
  LuaExpression,
  LuaIdentifier,
  LuaType,
  LuaTypeAliasDeclaration,
  LuaTypeAnnotation,
  LuaTypeReference,
  typeAliasDeclaration,
  typeAnnotation,
  typeFunction,
  typeLiteral,
  typePropertySignature,
  typeReference,
} from '@js-to-lua/lua-types';
import { isNonEmptyArray } from '@js-to-lua/shared-utils';
import { applyTo, pipe } from 'ramda';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createFunctionTypeParamsHandler } from '../../function-params.handler';
import { createTypeParameterDeclarationHandler } from '../../type/type-parameter-declaration.handler';
import {
  createClassIdentifierStatics,
  isClassConstructor,
} from './class-declaration.utils';

export const createHandleClassTypeStaticsAlias = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>,
  handleIdentifier: IdentifierStrictHandlerFunction,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    Babel.TypeAnnotation | Babel.TSTypeAnnotation | Babel.Noop
  >,
  handleType: HandlerFunction<LuaType, Babel.FlowType | Babel.TSType>
) => {
  return createHandlerFunction<
    LuaTypeAliasDeclaration,
    Babel.ClassDeclaration,
    EmptyConfig & { classIdentifier: LuaIdentifier }
  >(
    (source, config, node) => {
      const { classIdentifier } = config;

      const classIdentifierStatics =
        createClassIdentifierStatics(classIdentifier);

      const handleTypeParameterDeclaration =
        createTypeParameterDeclarationHandler(handleType).handler(
          source,
          config
        );

      const genericTypeParametersDeclaration =
        node.typeParameters &&
        !Babel.isNoop(node.typeParameters) &&
        node.typeParameters.params.length
          ? handleTypeParameterDeclaration(node.typeParameters)
          : undefined;

      const typeParameters = genericTypeParametersDeclaration
        ? applyTo(
            genericTypeParametersDeclaration.params,
            pipe(
              (params: Array<LuaTypeReference>) =>
                params.map(
                  (p): LuaTypeReference => ({
                    ...p,
                    defaultType: undefined,
                  })
                ),

              (params) => (isNonEmptyArray(params) ? params : undefined)
            )
          )
        : undefined;

      const constructorMethod = node.body.body.find(isClassConstructor);

      const functionTypeParamsHandler = createFunctionTypeParamsHandler(
        handleIdentifier,
        handleTypeAnnotation,
        handleType
      );

      const constructorParameters = functionTypeParamsHandler(
        source,
        {
          assignedTo: undefined,
          noShadowIdentifiers: undefined,
          ...config,
        },
        constructorMethod?.params ? constructorMethod : { params: [] }
      );

      const classType = typeLiteral([
        typePropertySignature(
          identifier('new'),
          typeAnnotation(
            typeFunction(
              constructorParameters,
              functionReturnType([
                typeReference(classIdentifier, typeParameters),
              ]),
              genericTypeParametersDeclaration
            )
          )
        ),
      ]);

      return typeAliasDeclaration(classIdentifierStatics, classType);
    },
    { skipComments: true }
  );
};
