import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaType } from '../type';
import { LuaIdentifier } from './identifier';

export type LuaFunctionParam = LuaIdentifier | LuaFunctionParamEllipse;

export interface LuaFunctionParamEllipse extends BaseLuaNode {
  type: 'LuaFunctionParamEllipse';
  typeAnnotation?: LuaType;
}

export const functionParamEllipse = (
  typeAnnotation: LuaFunctionParamEllipse['typeAnnotation']
): LuaFunctionParamEllipse => ({
  type: 'LuaFunctionParamEllipse',
  typeAnnotation,
});

export const isFunctionParamEllipse = isNodeType<LuaFunctionParamEllipse>(
  'LuaFunctionParamEllipse'
);
