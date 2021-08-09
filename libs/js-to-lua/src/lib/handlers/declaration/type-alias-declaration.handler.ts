import { Identifier, TSType, TSTypeAliasDeclaration } from '@babel/types';
import {
  LuaBinaryExpression,
  LuaIdentifier,
  LuaMemberExpression,
  LuaNilLiteral,
  LuaType,
  LuaTypeAliasDeclaration,
} from '@js-to-lua/lua-types';
import { BaseNodeHandler, createHandler, HandlerFunction } from '../../types';

export const createTypeAliasDeclarationHandler = (
  handleIdentifier: HandlerFunction<
    LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression,
    Identifier
  >,
  handleTsTypes: HandlerFunction<LuaType, TSType>
): BaseNodeHandler<LuaTypeAliasDeclaration, TSTypeAliasDeclaration> =>
  createHandler('TSTypeAliasDeclaration', (source, config, node) => ({
    type: 'LuaTypeAliasDeclaration',
    id: handleIdentifier(source, config, node.id) as LuaIdentifier,
    typeAnnotation: handleTsTypes(source, config, node.typeAnnotation),
  }));
