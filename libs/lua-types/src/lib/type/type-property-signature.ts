import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaExpression } from '../expression';
import { LuaTypeAnnotation } from './type-annotation';

export interface LuaPropertySignature extends BaseLuaNode {
  type: 'LuaPropertySignature';
  key: LuaExpression;
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
