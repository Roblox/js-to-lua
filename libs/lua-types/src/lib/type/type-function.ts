import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaFunctionTypeParam } from './type-function-param';
import { LuaFunctionReturnType } from './type-function-return-type';
import { LuaTypeParameterDeclaration } from './type-parameter-declaration';

export interface LuaTypeFunction extends BaseLuaNode {
  type: 'LuaTypeFunction';
  typeParameters?: LuaTypeParameterDeclaration;
  parameters: Array<LuaFunctionTypeParam>;
  returnType: LuaFunctionReturnType;
}

export const typeFunction = (
  parameters: LuaTypeFunction['parameters'],
  returnType: LuaTypeFunction['returnType'],
  typeParameters?: LuaTypeParameterDeclaration
): LuaTypeFunction => ({
  type: 'LuaTypeFunction',
  parameters,
  returnType: returnType,
  typeParameters,
});

export const isTypeFunction = isNodeType<LuaTypeFunction>('LuaTypeFunction');
