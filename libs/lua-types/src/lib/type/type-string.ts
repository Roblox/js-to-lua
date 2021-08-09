import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaTypeString extends BaseLuaNode {
  type: 'LuaTypeString';
}

export const typeString = (): LuaTypeString => ({
  type: 'LuaTypeString',
});

export const isTypeString = isNodeType<LuaTypeString>('LuaTypeString');
