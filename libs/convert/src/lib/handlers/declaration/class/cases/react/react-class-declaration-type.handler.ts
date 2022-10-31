import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  identifier,
  LuaExpression,
  LuaIdentifier,
  LuaLVal,
  LuaPropertySignature,
  LuaType,
  LuaTypeAliasDeclaration,
  LuaTypeAnnotation,
  typeAliasDeclaration,
  typeAny,
  typeIntersection,
  typeLiteral,
  typeReference,
} from '@js-to-lua/lua-types';
import { createTypeParameterDeclarationHandler } from '../../../../type/type-parameter-declaration.handler';
import {
  getConstructorTsParameters,
  getMethodsAndProperties,
  groupProperties,
} from '../../class-declaration.utils';
import { createHandleMethodsAndProperties } from '../../class-methods-properties.handler';
import { createParameterPropertyHandler } from '../../ts-parameter-property.handler';
import { isNotReactBuildIn } from './react.helpers';

export const createHandleReactClassTypeAlias = (
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
        ...methodsAndPropertiesGrouped.public
          .map(handleMethodsAndProperties)
          .filter(isNotReactBuildIn),
      ];

      const classOwnType = typeLiteral(publicTypes);

      const classType = typeIntersection([
        typeReference(identifier('React_Component'), [typeAny(), typeAny()]),
        classOwnType,
      ]);

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
