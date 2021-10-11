import { Identifier, TSType, TSTypeAliasDeclaration } from '@babel/types';
import {
  LuaBinaryExpression,
  LuaIdentifier,
  LuaMemberExpression,
  LuaNilLiteral,
  LuaType,
  LuaTypeAliasDeclaration,
  typeAliasDeclaration,
} from '@js-to-lua/lua-types';
import { BaseNodeHandler, createHandler, HandlerFunction } from '../../types';
import { createTsTypeParameterHandler } from '../type/ts-type-parameter.handler';

export const createTypeAliasDeclarationHandler = (
  handleIdentifier: HandlerFunction<
    LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression,
    Identifier
  >,
  handleTsTypes: HandlerFunction<LuaType, TSType>
): BaseNodeHandler<LuaTypeAliasDeclaration, TSTypeAliasDeclaration> =>
  createHandler('TSTypeAliasDeclaration', (source, config, node) => {
    const handleTsTypeParameter = createTsTypeParameterHandler().handler(
      source,
      config
    );
    return typeAliasDeclaration(
      handleIdentifier(source, config, node.id) as LuaIdentifier,
      handleTsTypes(source, config, node.typeAnnotation),
      node.typeParameters && node.typeParameters.params.length
        ? node.typeParameters.params.map(handleTsTypeParameter)
        : undefined
    );
  });
