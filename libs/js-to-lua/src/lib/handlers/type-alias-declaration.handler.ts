import { TSTypeAliasDeclaration } from '@babel/types';
import { LuaIdentifier, LuaTypeAliasDeclaration } from '@js-to-lua/lua-types';
import { BaseNodeHandler } from '../types';
import { handleIdentifier } from './expression-statement.handler';
import { handleTsTypes } from './type-annotation.handler';

export const handleTypeAliasDeclaration: BaseNodeHandler<
  TSTypeAliasDeclaration,
  LuaTypeAliasDeclaration
> = {
  type: 'TSTypeAliasDeclaration',
  handler: (node) => {
    return {
      type: 'LuaTypeAliasDeclaration',
      id: handleIdentifier.handler(node.id) as LuaIdentifier,
      typeAnnotation: handleTsTypes.handler(node.typeAnnotation),
    };
  },
};
