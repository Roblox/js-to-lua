import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaTypeAnnotation } from '../lua-nodes.types';
import { LuaExpression } from '../expression';

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
