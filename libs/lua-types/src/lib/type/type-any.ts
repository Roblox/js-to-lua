import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaTypeAny extends BaseLuaNode {
  type: 'LuaTypeAny';
}

export const typeAny = (): LuaTypeAny => ({
  type: 'LuaTypeAny',
});

export const isTypeAny = isNodeType<LuaTypeAny>('LuaTypeAny');
