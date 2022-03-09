import { Identifier, TSType, TSTypeAliasDeclaration } from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  LuaBinaryExpression,
  LuaIdentifier,
  LuaMemberExpression,
  LuaNilLiteral,
  LuaType,
  LuaTypeAliasDeclaration,
  typeAliasDeclaration,
} from '@js-to-lua/lua-types';
import { createTsTypeParameterDeclarationHandler } from '../type/ts-type-parameter-declaration.handler';

export const createTypeAliasDeclarationHandler = (
  handleIdentifier: HandlerFunction<
    LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression,
    Identifier
  >,
  handleTsTypes: HandlerFunction<LuaType, TSType>
): BaseNodeHandler<LuaTypeAliasDeclaration, TSTypeAliasDeclaration> =>
  createHandler('TSTypeAliasDeclaration', (source, config, node) => {
    const handleTsTypeParameterDeclaration =
      createTsTypeParameterDeclarationHandler().handler(source, config);

    return typeAliasDeclaration(
      handleIdentifier(source, config, node.id) as LuaIdentifier,
      handleTsTypes(source, config, node.typeAnnotation),
      node.typeParameters && node.typeParameters.params.length
        ? handleTsTypeParameterDeclaration(node.typeParameters)
        : undefined
    );
  });
