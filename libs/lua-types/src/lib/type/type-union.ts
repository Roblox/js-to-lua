import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaType } from './index';

export interface LuaTypeUnion extends BaseLuaNode {
  type: 'LuaTypeUnion';
  types: Array<LuaType>;
}

export const typeUnion = (types: Array<LuaType>): LuaTypeUnion => ({
  type: 'LuaTypeUnion',
  types,
});

export const isTypeUnion = isNodeType<LuaTypeUnion>('LuaTypeUnion');
