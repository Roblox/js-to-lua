import { LuaTypeNumber, LuaTypeString } from '.';
import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaTypeAnnotation } from './type-annotation';

export interface LuaIndexSignature extends BaseLuaNode {
  type: 'LuaIndexSignature';
  parameter: LuaTypeString | LuaTypeNumber;
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
