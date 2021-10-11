import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaType } from './type';

export interface LuaTypeIntersection extends BaseLuaNode {
  type: 'LuaTypeIntersection';
  types: Array<LuaType>;
}

export const typeIntersection = (
  types: Array<LuaType>
): LuaTypeIntersection => ({
  type: 'LuaTypeIntersection',
  types,
});

export const isTypeIntersection = isNodeType<LuaTypeIntersection>(
  'LuaTypeIntersection'
);
