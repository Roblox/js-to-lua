import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaPropertySignature } from './type-property-signature';

export interface LuaTypeLiteral extends BaseLuaNode {
  type: 'LuaTypeLiteral';
  members: Array<LuaTypeElement>;
}

type LuaTypeElement =
  LuaPropertySignature; /*| TSCallSignatureDeclaration | TSConstructSignatureDeclaration |  TSMethodSignature | TSIndexSignature*/

export const typeLiteral = (
  members: LuaTypeLiteral['members']
): LuaTypeLiteral => ({
  type: 'LuaTypeLiteral',
  members,
});

export const isTypeLiteral = isNodeType<LuaTypeLiteral>('LuaTypeLiteral');
