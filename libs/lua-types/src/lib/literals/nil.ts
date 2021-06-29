import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaNilLiteral extends BaseLuaNode {
  type: 'NilLiteral';
}

export const nilLiteral = (): LuaNilLiteral => ({
  type: 'NilLiteral',
});

export const isNilLiteral = isNodeType<LuaNilLiteral>('NilLiteral');
