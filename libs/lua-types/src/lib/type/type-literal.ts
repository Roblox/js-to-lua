import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaIndexSignature } from './type-index-signature';
import { LuaPropertySignature } from './type-property-signature';

export interface LuaTypeLiteral extends BaseLuaNode {
  type: 'LuaTypeLiteral';
  members: Array<LuaTypeElement>;
}

export type LuaTypeElement =
  | LuaPropertySignature
  | LuaIndexSignature; /*| TSCallSignatureDeclaration | TSConstructSignatureDeclaration |  TSMethodSignature */

export const typeLiteral = (
  members: LuaTypeLiteral['members']
): LuaTypeLiteral => ({
  type: 'LuaTypeLiteral',
  members,
});

export const isTypeLiteral = isNodeType<LuaTypeLiteral>('LuaTypeLiteral');
