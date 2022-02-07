import { LuaBooleanLiteral, LuaStringLiteral } from '../literals';
import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaLiteralType extends BaseLuaNode {
  type: 'LuaLiteralType';
  literal: LuaStringLiteral | LuaBooleanLiteral;
}

export const literalType = (
  literal: LuaLiteralType['literal']
): LuaLiteralType => ({
  type: 'LuaLiteralType',
  literal,
});

export const isLiteralType = isNodeType<LuaLiteralType>('LuaLiteralType');
