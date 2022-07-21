import { LuaFunctionParam, LuaIdentifier } from '../expression';
import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaNodeGroup, nodeGroup } from '../statement';
import {
  functionReturnType,
  LuaFunctionReturnType,
  LuaType,
  LuaTypeParameterDeclaration,
} from '../type';

export interface LuaFunctionDeclaration extends BaseLuaNode {
  type: 'FunctionDeclaration';
  id: LuaIdentifier;
  params: Array<LuaFunctionParam>;
  body: LuaNodeGroup;
  returnType?: LuaFunctionReturnType;
  isLocal: boolean;
  typeParams?: LuaTypeParameterDeclaration;
}

export const functionDeclaration = (
  id: LuaFunctionDeclaration['id'],
  params: LuaFunctionDeclaration['params'] = [],
  body: LuaFunctionDeclaration['body'] = nodeGroup([]),
  returnType?: LuaType,
  isLocal: LuaFunctionDeclaration['isLocal'] = true,
  typeParams?: LuaFunctionDeclaration['typeParams']
): LuaFunctionDeclaration => ({
  type: 'FunctionDeclaration',
  id,
  typeParams,
  params,
  body,
  returnType: returnType ? functionReturnType([returnType]) : undefined,
  isLocal,
});

export const functionDeclarationMultipleReturn = (
  id: LuaFunctionDeclaration['id'],
  params: LuaFunctionDeclaration['params'] = [],
  body: LuaFunctionDeclaration['body'] = nodeGroup([]),
  returnType: LuaFunctionDeclaration['returnType'],
  isLocal: LuaFunctionDeclaration['isLocal'] = true,
  typeParams?: LuaFunctionDeclaration['typeParams']
): LuaFunctionDeclaration => ({
  type: 'FunctionDeclaration',
  id,
  typeParams,
  params,
  body,
  returnType,
  isLocal,
});

export const isFunctionDeclaration = isNodeType<LuaFunctionDeclaration>(
  'FunctionDeclaration'
);
