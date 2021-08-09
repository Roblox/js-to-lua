import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaTypeVoid extends BaseLuaNode {
  type: 'LuaTypeVoid';
}

export const typeVoid = (): LuaTypeVoid => ({
  type: 'LuaTypeVoid',
});

export const isTypeVoid = isNodeType<LuaTypeVoid>('LuaTypeVoid');
