import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaTypeNumber extends BaseLuaNode {
  type: 'LuaTypeNumber';
}

export const typeNumber = (): LuaTypeNumber => ({
  type: 'LuaTypeNumber',
});

export const isTypeNumber = isNodeType<LuaTypeNumber>('LuaTypeNumber');
