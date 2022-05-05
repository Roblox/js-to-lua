import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaType, typeAny } from '../type';

export interface LuaTypeOptional extends BaseLuaNode {
  type: 'LuaTypeOptional';
  typeAnnotation: LuaType;
}

export const typeOptional = (typeAnnotation: LuaType): LuaTypeOptional => ({
  type: 'LuaTypeOptional',
  typeAnnotation,
});

export const isTypeOptional = isNodeType<LuaTypeOptional>('LuaTypeOptional');

export const makeOptional = (typeAnnotation?: LuaType) =>
  typeAnnotation && isTypeOptional(typeAnnotation)
    ? typeAnnotation
    : typeOptional(typeAnnotation || typeAny());
