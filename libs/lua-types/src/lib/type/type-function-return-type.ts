import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaType } from './type';

export interface LuaFunctionReturnType extends BaseLuaNode {
  type: 'LuaFunctionReturnType';
  returnTypes: LuaType[];
}

export const functionReturnType = (
  returnTypes: LuaFunctionReturnType['returnTypes']
): LuaFunctionReturnType => ({
  type: 'LuaFunctionReturnType',
  returnTypes,
});

export const isFunctionReturnType = isNodeType<LuaFunctionReturnType>(
  'LuaFunctionReturnType'
);
