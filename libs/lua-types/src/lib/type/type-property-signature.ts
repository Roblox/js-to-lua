import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaTypeAnnotation } from './type-annotation';
import { LuaTypeNumber } from './type-number';
import { LuaIdentifier } from '../expression';
import { LuaStringLiteral } from '../literals';
import { LuaTypeString } from './type-string';

export interface LuaPropertySignature extends BaseLuaNode {
  type: 'LuaPropertySignature';
  key: LuaIdentifier | LuaStringLiteral | LuaTypeString | LuaTypeNumber;
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
