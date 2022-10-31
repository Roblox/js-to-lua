import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  isIdentifier,
  LuaExpression,
  LuaIdentifier,
  LuaLVal,
  LuaPropertySignature,
  LuaType,
  LuaTypeAliasDeclaration,
  LuaTypeAnnotation,
  typeAliasDeclaration,
  typeIntersection,
  typeLiteral,
  typeReference,
} from '@js-to-lua/lua-types';
import { isNonEmptyArray } from '@js-to-lua/shared-utils';
import { applyTo } from 'ramda';
import { createTypeParameterDeclarationHandler } from '../../../../type/type-parameter-declaration.handler';
import {
  getConstructorTsParameters,
  getMethodsAndProperties,
  groupProperties,
} from '../../class-declaration.utils';
import { createHandleMethodsAndProperties } from '../../class-methods-properties.handler';
import { createParameterPropertyHandler } from '../../ts-parameter-property.handler';

export const createHandleClassTypeAlias = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>,
  handleIdentifier: HandlerFunction<LuaLVal, Babel.LVal>,
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

      const constructorTsParametersGrouped = groupProperties(
        getConstructorTsParameters(node)
      );

      const methodsAndPropertiesGrouped = groupProperties(
        getMethodsAndProperties(node)
      );

      const handleMethodsAndProperties = createHandleMethodsAndProperties(
        handleExpression,
        handleIdentifier,
        handleTypeAnnotation,
        handleType
      )(source, { ...config, classIdentifier });

      const toTypePropertySignature = createParameterPropertyHandler(
        handleIdentifier,
        handleTypeAnnotation
      )(source, config);

      const publicTypes: LuaPropertySignature[] = [
        ...constructorTsParametersGrouped.publicExplicit.map(
          toTypePropertySignature
        ),
        ...methodsAndPropertiesGrouped.public.map(handleMethodsAndProperties),
      ];

      const classOwnType = typeLiteral(publicTypes);

      const superTypeParameters = node.superTypeParameters
        ? applyTo(
            node.superTypeParameters.params.map((p) =>
              handleType(source, config, p)
            ),
            (arr) => (isNonEmptyArray(arr) ? arr : undefined)
          )
        : undefined;

      const superClass = node.superClass
        ? handleExpression(source, config, node.superClass)
        : undefined;

      const classType = !superClass
        ? classOwnType
        : isIdentifier(superClass)
        ? typeIntersection([
            typeReference(superClass, superTypeParameters),
            classOwnType,
          ])
        : withTrailingConversionComment(
            classOwnType,
            `ROBLOX comment: Unhandled superclass type: ${superClass.type}`
          );

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

      return typeAliasDeclaration(
        classIdentifier,
        classType,
        genericTypeParametersDeclaration
      );
    },
    { skipComments: true }
  );
};
