import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaTypeAnnotation } from './type-annotation';
import { LuaTypeString } from './type-string';
import { LuaTypeNumber } from './type-number';
import { LuaIdentifier } from '../lua-nodes.types';

export interface LuaPropertySignature extends BaseLuaNode {
  type: 'LuaPropertySignature';
  key: LuaIdentifier | LuaTypeString | LuaTypeNumber;
  typeAnnotation?: LuaTypeAnnotation;
}

export const typePropertySignature = (
  key: LuaPropertySignature['key'],
  typeAnnotation?: LuaPropertySignature['typeAnnotation']
): LuaPropertySignature => ({
  type: 'LuaPropertySignature',
  key,
  typeAnnotation,
});

export const isPropertySignature = isNodeType<LuaPropertySignature>(
  'LuaPropertySignature'
);
