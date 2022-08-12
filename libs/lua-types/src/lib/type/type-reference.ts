import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaIdentifier } from '../expression';
import { LuaType } from './type';
import { NonEmptyArray } from '@js-to-lua/shared-utils';

export interface LuaTypeReference extends BaseLuaNode {
  type: 'TypeReference';
  typeName: LuaIdentifier;
  typeParameters?: NonEmptyArray<LuaType>;
  defaultType?: LuaType;
}

export const typeReference = (
  typeName: LuaTypeReference['typeName'],
  typeParameters?: LuaTypeReference['typeParameters'],
  defaultType?: LuaTypeReference['defaultType']
): LuaTypeReference => ({
  type: 'TypeReference',
  typeName,
  ...(typeParameters ? { typeParameters } : {}),
  ...(defaultType ? { defaultType } : {}),
});

export const isTypeReference = isNodeType<LuaTypeReference>('TypeReference');
