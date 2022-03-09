import { LuaTypeReference } from '../type';
import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaTypeParameterDeclaration extends BaseLuaNode {
  type: 'LuaTypeParameterDeclaration';
  params: LuaTypeReference[];
}

export const typeParameterDeclaration = (
  params: LuaTypeParameterDeclaration['params']
): LuaTypeParameterDeclaration => ({
  type: 'LuaTypeParameterDeclaration',
  params,
});

export const isTypeParameterDeclaration =
  isNodeType<LuaTypeParameterDeclaration>('LuaTypeParameterDeclaration');
