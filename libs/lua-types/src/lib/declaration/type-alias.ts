import { LuaIdentifier, LuaMemberExpression } from '../lua-nodes.types';
import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaType, LuaTypeReference } from '../type';

export interface LuaTypeAliasDeclaration extends BaseLuaNode {
  type: 'LuaTypeAliasDeclaration';
  id: LuaIdentifier;
  typeAnnotation: LuaType | LuaMemberExpression;
  typeParameters?: LuaTypeReference[];
}

export const isTypeAliasDeclaration = isNodeType<LuaTypeAliasDeclaration>(
  'LuaTypeAliasDeclaration'
);

export const typeAliasDeclaration = (
  id: LuaTypeAliasDeclaration['id'],
  typeAnnotation: LuaTypeAliasDeclaration['typeAnnotation'],
  typeParameters?: LuaTypeAliasDeclaration['typeParameters']
): LuaTypeAliasDeclaration => ({
  type: 'LuaTypeAliasDeclaration',
  id,
  typeAnnotation,
  ...(typeParameters ? { typeParameters } : {}),
});