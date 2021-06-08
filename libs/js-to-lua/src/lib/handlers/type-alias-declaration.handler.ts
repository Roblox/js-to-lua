import { TSTypeAliasDeclaration } from '@babel/types';
import { LuaIdentifier, LuaTypeAliasDeclaration } from '@js-to-lua/lua-types';
import { BaseNodeHandler, createHandler } from '../types';
import { handleIdentifier } from './expression-statement.handler';
import { handleTsTypes } from './type-annotation.handler';

export const handleTypeAliasDeclaration: BaseNodeHandler<
  TSTypeAliasDeclaration,
  LuaTypeAliasDeclaration
> = createHandler('TSTypeAliasDeclaration', (source, node) => ({
  type: 'LuaTypeAliasDeclaration',
  id: handleIdentifier.handler(source, node.id) as LuaIdentifier,
  typeAnnotation: handleTsTypes.handler(source, node.typeAnnotation),
}));
