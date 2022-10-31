import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { defaultStatementHandler } from '@js-to-lua/lua-conversion-utils';
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
import { IdentifierStrictHandlerFunction } from '../../../../expression/identifier-handler-types';
import { createFunctionParamsWithBodyHandler } from '../../../../function-params-with-body.handler';
import { createTypeParameterDeclarationHandler } from '../../../../type/type-parameter-declaration.handler';
import {
  createClassIdentifierStatics,
  isClassConstructor,
} from '../../class-declaration.utils';

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

      const handleParamsWithBody = createFunctionParamsWithBodyHandler(
        handleIdentifier,
        defaultStatementHandler,
        defaultStatementHandler,
        defaultStatementHandler,
        handleTypeAnnotation,
        handleType
      );

      const constructorParameters = handleParamsWithBody(
        source,
        {
          assignedTo: undefined,
          noShadowIdentifiers: undefined,
          ...config,
        },
        constructorMethod?.params ? constructorMethod : { params: [] }
      ).typeParams;

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
