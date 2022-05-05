import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaType } from './type';
import { LuaTypeAnnotation } from './type-annotation';

export interface LuaIndexSignature extends BaseLuaNode {
  type: 'LuaIndexSignature';
  parameter: LuaType;
  typeAnnotation: LuaTypeAnnotation;
}

export const typeIndexSignature = (
  parameter: LuaIndexSignature['parameter'],
  typeAnnotation: LuaIndexSignature['typeAnnotation']
): LuaIndexSignature => ({
  type: 'LuaIndexSignature',
  parameter,
  typeAnnotation,
});

export const isIndexSignature =
  isNodeType<LuaIndexSignature>('LuaIndexSignature');
