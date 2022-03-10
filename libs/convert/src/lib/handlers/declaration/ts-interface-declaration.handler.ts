import {
  Expression,
  Identifier,
  isIdentifier as isBabelIdentifier,
  Noop,
  TSExpressionWithTypeArguments,
  TSInterfaceDeclaration,
  TSType,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { defaultExpressionHandler } from '@js-to-lua/lua-conversion-utils';
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
import { createTsInterfaceBodyHandler } from '../type/ts-interface-body.handler';
import { createTsTypeParameterDeclarationHandler } from '../type/ts-type-parameter-declaration.handler';

export const createTsInterfaceHandler = (
  handleIdentifier: HandlerFunction<
    LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression,
    Identifier
  >,
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>,
  typesHandlerFunction: HandlerFunction<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >,
  tsTypeHandlerFunction: HandlerFunction<LuaType, TSType>
) => {
  const handleTsInterfaceBody = createTsInterfaceBodyHandler(
    expressionHandlerFunction,
    typesHandlerFunction
  ).handler;

  return createHandler<LuaTypeAliasDeclaration, TSInterfaceDeclaration>(
    'TSInterfaceDeclaration',
    (source, config, node) => {
      const interfaceBody = handleTsInterfaceBody(source, config, node.body);
      const handleTsExpressionWithTypeArguments = (
        tsExpressionNode: TSExpressionWithTypeArguments
      ): LuaType =>
        isBabelIdentifier(tsExpressionNode.expression)
          ? typeReference(
              handleIdentifier(source, config, tsExpressionNode.expression),
              tsExpressionNode.typeParameters &&
                tsExpressionNode.typeParameters.params.length
                ? (tsExpressionNode.typeParameters.params.map(
                    tsTypeHandlerFunction(source, config)
                  ) as NonEmptyArray<LuaType>)
                : undefined
            )
          : defaultExpressionHandler(
              source,
              config,
              tsExpressionNode.expression
            );

      const handleTsTypeParameterDeclaration =
        createTsTypeParameterDeclarationHandler(tsTypeHandlerFunction).handler(
          source,
          config
        );

      return typeAliasDeclaration(
        handleIdentifier(source, config, node.id) as LuaIdentifier,
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
