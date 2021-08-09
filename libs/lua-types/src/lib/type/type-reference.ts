import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaIdentifier } from '../lua-nodes.types';
import { LuaType } from './index';
import { NonEmptyArray } from '@js-to-lua/shared-utils';

export interface LuaTypeReference extends BaseLuaNode {
  type: 'TypeReference';
  typeName: LuaIdentifier;
  typeParameters?: NonEmptyArray<LuaType>;
}

export const typeReference = (
  typeName: LuaTypeReference['typeName'],
  typeParameters?: LuaTypeReference['typeParameters']
): LuaTypeReference => ({
  type: 'TypeReference',
  typeName,
  ...(typeParameters ? { typeParameters } : {}),
});

export const isTypeReference = isNodeType<LuaTypeReference>('TypeReference');
