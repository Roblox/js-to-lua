import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaType } from './type';
import { makeOptional } from './type-optional';

export interface LuaTypeAnnotation extends BaseLuaNode {
  type: 'LuaTypeAnnotation';
  typeAnnotation: LuaType;
}

export const typeAnnotation = (
  typeAnnotation: LuaTypeAnnotation['typeAnnotation']
): LuaTypeAnnotation => ({
  type: 'LuaTypeAnnotation',
  typeAnnotation,
});

export const isTypeAnnotation =
  isNodeType<LuaTypeAnnotation>('LuaTypeAnnotation');

export const makeOptionalAnnotation =
  (optional: boolean) =>
  (annotation: LuaTypeAnnotation): LuaTypeAnnotation =>
    optional
      ? {
          ...annotation,
          typeAnnotation: makeOptional(annotation.typeAnnotation),
        }
      : annotation;

export interface UnhandledTypeAnnotation extends BaseLuaNode {
  type: 'UnhandledTypeAnnotation';
}

export const unhandledTypeAnnotation = (): UnhandledTypeAnnotation => ({
  type: 'UnhandledTypeAnnotation',
});

export type TypeAnnotation = LuaTypeAnnotation | UnhandledTypeAnnotation;
