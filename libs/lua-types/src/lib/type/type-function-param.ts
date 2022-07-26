import { LuaIdentifier } from '../expression';
import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaType } from './type';

export type LuaFunctionTypeParam =
  | LuaFunctionParamName
  | LuaFunctionTypeParamEllipse;

export interface LuaFunctionParamName extends BaseLuaNode {
  type: 'LuaFunctionParamName';
  name: LuaIdentifier | null;
  typeAnnotation: LuaType;
}

export const functionParamName = (
  name: LuaFunctionParamName['name'],
  typeAnnotation: LuaFunctionParamName['typeAnnotation']
): LuaFunctionParamName => ({
  type: 'LuaFunctionParamName',
  name: name && { ...name, typeAnnotation: undefined },
  typeAnnotation,
});

export const isFunctionParamName = isNodeType<LuaFunctionParamName>(
  'LuaFunctionParamName'
);

export interface LuaFunctionTypeParamEllipse extends BaseLuaNode {
  type: 'LuaFunctionTypeParamEllipse';
  typeAnnotation?: LuaType;
}

export const functionTypeParamEllipse = (
  typeAnnotation: LuaFunctionTypeParamEllipse['typeAnnotation']
): LuaFunctionTypeParamEllipse => ({
  type: 'LuaFunctionTypeParamEllipse',
  typeAnnotation,
});

export const isFunctionTypeParamEllipse =
  isNodeType<LuaFunctionTypeParamEllipse>('LuaFunctionTypeParamEllipse');
