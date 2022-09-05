import * as Babel from '@babel/types';
import {
  createOptionalHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  addSectionHeader,
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
  typeIntersection,
  typeLiteral,
  typePropertySignature,
  typeReference,
} from '@js-to-lua/lua-types';
import { isNonEmptyArray } from '@js-to-lua/shared-utils';
import { applyTo } from 'ramda';
import { createTypeParameterDeclarationHandler } from '../../type/type-parameter-declaration.handler';
import {
  createClassIdentifierPrivate,
  hasNonPublicMembers,
  isClassConstructor,
  isClassMethod,
  isPrivate,
  isProtected,
  isPublic,
} from './class-declaration.utils';
import { createHandleMethodsAndProperties } from './class-methods-properties.handler';
import { createClassTsParameterPropertyHandler } from './class-ts-parameter-property.handler';

export const createHandleClassTypePrivateAlias = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>,
  handleIdentifier: HandlerFunction<LuaLVal, Babel.LVal>,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    Babel.TypeAnnotation | Babel.TSTypeAnnotation | Babel.Noop
  >,
  handleType: HandlerFunction<LuaType, Babel.FlowType | Babel.TSType>
) => {
  let unhandledAssignments = 0;

  return createOptionalHandlerFunction<
    LuaTypeAliasDeclaration,
    Babel.ClassDeclaration,
    EmptyConfig & { classIdentifier: LuaIdentifier }
  >((source, config, node) => {
    if (!hasNonPublicMembers(node)) {
      return undefined;
    }

    const classIdentifierPrivate = createClassIdentifierPrivate(
      config.classIdentifier
    );

    const constructorMethod = node.body.body.find(isClassConstructor);

    const constructorTsParameters: Babel.TSParameterProperty[] =
      (constructorMethod &&
        constructorMethod.params.filter((n): n is Babel.TSParameterProperty =>
          Babel.isTSParameterProperty(n)
        )) ||
      [];

    const constructorPublicTsParameters =
      constructorTsParameters.filter(isPublic);
    const constructorPrivateTsParameters =
      constructorTsParameters.filter(isPrivate);
    const constructorProtectedTsParameters =
      constructorTsParameters.filter(isProtected);

    const bodyWithoutConstructor = node.body.body.filter(
      (n) => !isClassConstructor(n)
    );

    const methodsAndProperties = bodyWithoutConstructor.filter(
      (
        n
      ): n is Babel.ClassMethod | Babel.TSDeclareMethod | Babel.ClassProperty =>
        (isClassMethod(n) || Babel.isClassProperty(n)) && !n.static
    );
    const handleMethodsAndProperties = createHandleMethodsAndProperties(
      handleExpression,
      handleIdentifier,
      handleTypeAnnotation,
      handleType
    )(source);

    const handlePrivateMethodsAndProperties = handleMethodsAndProperties({
      ...config,
      classIdentifier: classIdentifierPrivate,
    });

    const publicMethodsAndProperties = methodsAndProperties.filter(isPublic);
    const privateMethodsAndProperties = methodsAndProperties.filter(isPrivate);
    const protectedMethodsAndProperties =
      methodsAndProperties.filter(isProtected);

    const handleClassTsParameterProperty =
      createClassTsParameterPropertyHandler(handleTypeAnnotation)(
        source,
        config
      );

    const publicTypes: LuaPropertySignature[] = [
      ...constructorPublicTsParameters.map((property) => {
        const id = getParameterPropertyIdentifier(property);
        return typePropertySignature(
          removeTypeAnnotation(id),
          handleClassTsParameterProperty(property)
        );
      }),
      ...publicMethodsAndProperties.map(handlePrivateMethodsAndProperties),
    ];

    const privateTypes: LuaPropertySignature[] = [
      ...constructorPrivateTsParameters.map((property) => {
        const id = getParameterPropertyIdentifier(property);
        return typePropertySignature(
          removeTypeAnnotation(id),
          handleClassTsParameterProperty(property)
        );
      }),
      ...privateMethodsAndProperties.map(handlePrivateMethodsAndProperties),
    ];

    const protectedTypes: LuaPropertySignature[] = [
      ...constructorProtectedTsParameters.map((property) => {
        const id = getParameterPropertyIdentifier(property);
        return typePropertySignature(
          removeTypeAnnotation(id),
          handleClassTsParameterProperty(property)
        );
      }),
      ...protectedMethodsAndProperties.map(handlePrivateMethodsAndProperties),
    ];

    const classOwnType = typeLiteral([
      ...addSectionHeader(publicTypes, 'PUBLIC'),
      ...addSectionHeader(protectedTypes, 'PROTECTED'),
      ...addSectionHeader(privateTypes, 'PRIVATE'),
    ]);
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
      createTypeParameterDeclarationHandler(handleType).handler(source, config);

    const genericTypeParametersDeclaration =
      node.typeParameters &&
      !Babel.isNoop(node.typeParameters) &&
      node.typeParameters.params.length
        ? handleTypeParameterDeclaration(node.typeParameters)
        : undefined;

    return typeAliasDeclaration(
      classIdentifierPrivate,
      classType,
      genericTypeParametersDeclaration
    );

    // TODO remove duplication
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
  });
};
