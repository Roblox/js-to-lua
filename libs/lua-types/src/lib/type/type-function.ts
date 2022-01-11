import { LuaTypeAnnotation } from '.';
import { LuaIdentifier } from '../expression';
import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaType } from './type';
import { LuaPropertySignature } from './type-property-signature';

export interface LuaTypeFunction extends BaseLuaNode {
  type: 'LuaTypeFunction';
  parameters: Array<LuaTypeElement>;
  returnType: LuaType | LuaTypeAnnotation;
}

type LuaTypeElement = LuaPropertySignature | LuaIdentifier;

export const typeFunction = (
  parameters: LuaTypeFunction['parameters'],
  returnType: LuaTypeFunction['returnType']
): LuaTypeFunction => ({
  type: 'LuaTypeFunction',
  parameters,
  returnType,
});

export const isTypeFunction = isNodeType<LuaTypeFunction>('LuaTypeFunction');
