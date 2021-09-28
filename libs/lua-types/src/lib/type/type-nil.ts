import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaTypeNil extends BaseLuaNode {
  type: 'LuaTypeNil';
}

export const typeNil = (): LuaTypeNil => ({
  type: 'LuaTypeNil',
});

export const isTypeNil = isNodeType<LuaTypeNil>('LuaTypeNil');
