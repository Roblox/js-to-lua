import {
  Expression,
  Identifier,
  isIdentifier as isBabelIdentifier,
  isIdentifier,
  Noop,
  TSExpressionWithTypeArguments,
  TSInterfaceDeclaration,
  TSType,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { defaultUnhandledIdentifierHandlerWithComment } from '@js-to-lua/lua-conversion-utils';
import {
  LuaBinaryExpression,
  LuaExpression,
  LuaIdentifier,
  LuaMemberExpression,
  LuaNilLiteral,
  LuaType,
  LuaTypeAliasDeclaration,
  LuaTypeAnnotation,
  typeAliasDeclaration,
  typeIntersection,
  typeReference,
} from '@js-to-lua/lua-types';
import { NonEmptyArray } from '@js-to-lua/shared-utils';
import { createTsInterfaceBodyHandler } from '../type/ts/ts-interface-body.handler';
import { createTsQualifiedNameHandler } from '../type/ts/ts-qualified-name.handler';
import { createTsTypeParameterDeclarationHandler } from '../type/ts/ts-type-parameter-declaration.handler';

export const createTsInterfaceHandler = (
  handleIdentifier: HandlerFunction<
    LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression,
    Identifier
  >,
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  typeAnnotationHandlerFunction: HandlerFunction<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >,
  tsTypeHandlerFunction: HandlerFunction<LuaType, TSType>
) => {
  const handleTsInterfaceBody = createTsInterfaceBodyHandler(
    handleIdentifier,
    expressionHandlerFunction,
    typeAnnotationHandlerFunction,
    tsTypeHandlerFunction
  ).handler;

  return createHandler<LuaTypeAliasDeclaration, TSInterfaceDeclaration>(
    'TSInterfaceDeclaration',
    (source, config, node) => {
      const maybeTypeId = handleIdentifier(source, config, node.id);
      const typeId = isIdentifier(maybeTypeId)
        ? maybeTypeId
        : defaultUnhandledIdentifierHandlerWithComment()(
            source,
            config,
            node.id
          );

      const interfaceBody = handleTsInterfaceBody(
        source,
        { ...config, typeId },
        node.body
      );
      const handleTsQualifiedName = createTsQualifiedNameHandler().handler;

      const handleTsExpressionWithTypeArguments = (
        tsExpressionNode: TSExpressionWithTypeArguments
      ): LuaType =>
        typeReference(
          isBabelIdentifier(tsExpressionNode.expression)
            ? handleIdentifier(source, config, tsExpressionNode.expression)
            : handleTsQualifiedName(
                source,
                config,
                tsExpressionNode.expression
              ),
          tsExpressionNode.typeParameters &&
            tsExpressionNode.typeParameters.params.length
            ? (tsExpressionNode.typeParameters.params.map(
                tsTypeHandlerFunction(source, config)
              ) as NonEmptyArray<LuaType>)
            : undefined
        );

      const handleTsTypeParameterDeclaration =
        createTsTypeParameterDeclarationHandler(tsTypeHandlerFunction).handler(
          source,
          config
        );

      return typeAliasDeclaration(
        typeId,
        node.extends && node.extends.length
          ? typeIntersection([
              ...node.extends.map(handleTsExpressionWithTypeArguments),
              interfaceBody,
            ])
          : interfaceBody,
        node.typeParameters && node.typeParameters.params.length
          ? handleTsTypeParameterDeclaration(node.typeParameters)
          : undefined
      );
    }
  );
};
