import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  removeTypeAnnotation,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  isIdentifier,
  LuaExpression,
  LuaIdentifier,
  LuaLVal,
  LuaPropertySignature,
  LuaType,
  LuaTypeAliasDeclaration,
  LuaTypeAnnotation,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeIntersection,
  typeLiteral,
  typePropertySignature,
  typeReference,
} from '@js-to-lua/lua-types';
import { isNonEmptyArray } from '@js-to-lua/shared-utils';
import { applyTo } from 'ramda';
import { inferType } from '../../type/infer-type';
import { createTypeParameterDeclarationHandler } from '../../type/type-parameter-declaration.handler';
import {
  isClassConstructor,
  isPublic,
  isPublicClassMethod,
} from './class-declaration.utils';
import { createHandlePublicMethodsAndProperties } from './class-public-methods-properties.handler';

export const createHandleClassTypeAlias = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>,
  handleIdentifier: HandlerFunction<LuaLVal, Babel.LVal>,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    Babel.TypeAnnotation | Babel.TSTypeAnnotation | Babel.Noop
  >,
  handleType: HandlerFunction<LuaType, Babel.FlowType | Babel.TSType>
) => {
  let unhandledAssignments = 0;

  return createHandlerFunction<
    LuaTypeAliasDeclaration,
    Babel.ClassDeclaration,
    EmptyConfig & { classIdentifier: LuaIdentifier }
  >(
    (source, config, node) => {
      const { classIdentifier } = config;

      const constructorMethod = node.body.body.find(isClassConstructor);

      const constructorPublicTsParameters: Babel.TSParameterProperty[] =
        (constructorMethod &&
          constructorMethod.params.filter(
            (n): n is Babel.TSParameterProperty =>
              Babel.isTSParameterProperty(n) && n.accessibility === 'public'
          )) ||
        [];

      const bodyWithoutConstructor = node.body.body.filter(
        (n) => !isClassConstructor(n)
      );

      const publicMethodsAndProperties = [
        ...bodyWithoutConstructor.filter(
          (
            n
          ): n is
            | Babel.ClassMethod
            | Babel.TSDeclareMethod
            | Babel.ClassProperty =>
            (isPublicClassMethod(n) || Babel.isClassProperty(n)) &&
            !n.static &&
            isPublic(n)
        ),
      ];

      const handlePublicMethodsAndProperties =
        createHandlePublicMethodsAndProperties(
          handleExpression,
          handleIdentifier,
          handleTypeAnnotation,
          handleType
        )(source, { ...config, classIdentifier });

      const publicTypes: LuaPropertySignature[] = [
        ...constructorPublicTsParameters.map((property) => {
          const id = getParameterPropertyIdentifier(property);
          return typePropertySignature(
            removeTypeAnnotation(id),
            handleClassTsParameterProperty(property)
          );
        }),
        ...publicMethodsAndProperties.map(handlePublicMethodsAndProperties),
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

      function handleClassTsParameterProperty(
        property: Babel.TSParameterProperty
      ): LuaTypeAnnotation {
        return property.parameter.typeAnnotation
          ? handleTypeAnnotation(
              source,
              config,
              property.parameter.typeAnnotation
            )
          : Babel.isAssignmentPattern(property.parameter)
          ? !Babel.isMemberExpression(property.parameter.left) &&
            property.parameter.left.typeAnnotation
            ? handleTypeAnnotation(
                source,
                config,
                property.parameter.left.typeAnnotation
              )
            : typeAnnotation(inferType(property.parameter.right))
          : typeAnnotation(typeAny());
      }

      function getParameterPropertyIdentifier({
        parameter,
      }: Babel.TSParameterProperty): LuaIdentifier {
        if (Babel.isIdentifier(parameter)) {
          return handleIdentifier(source, config, parameter);
        } else if (Babel.isIdentifier(parameter.left)) {
          return handleIdentifier(source, config, parameter.left);
        } else {
          return withTrailingConversionComment(
            identifier(`__unhandled__${'_'.repeat(unhandledAssignments++)}`),
            getNodeSource(source, parameter.left)
          );
        }
      }
    },
    { skipComments: true }
  );
};
