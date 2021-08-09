import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaTypeBoolean extends BaseLuaNode {
  type: 'LuaTypeBoolean';
}

export const typeBoolean = (): LuaTypeBoolean => ({
  type: 'LuaTypeBoolean',
});

export const isTypeBoolean = isNodeType<LuaTypeBoolean>('LuaTypeBoolean');
