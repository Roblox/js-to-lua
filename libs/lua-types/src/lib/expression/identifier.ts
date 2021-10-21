import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaTypeAnnotation } from '../type';

export interface LuaIdentifier extends BaseLuaNode {
  type: 'Identifier';
  name: string;
  typeAnnotation?: LuaTypeAnnotation;
}

export const identifier = (
  name: string,
  typeAnnotation?: LuaTypeAnnotation
): LuaIdentifier => ({
  type: 'Identifier',
  name,
  ...(typeAnnotation ? { typeAnnotation } : {}),
});

export const isIdentifier = isNodeType<LuaIdentifier>('Identifier');
