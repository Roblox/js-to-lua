import { LuaFunctionParam, LuaIdentifier } from '../expression';
import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaNodeGroup, LuaStatement, nodeGroup } from '../statement';
import {
  LuaFunctionReturnType,
  LuaTypeParameterDeclaration,
  functionReturnType,
  LuaType,
} from '../type';
import { UnhandledElement } from '../unhandled';

export interface LuaFunctionDeclaration extends BaseLuaNode {
  type: 'FunctionDeclaration';
  id: LuaIdentifier;
  params: Array<LuaFunctionParam>;
  body: LuaNodeGroup<LuaStatement>;
  returnType?: LuaFunctionReturnType;
  isLocal: boolean;
  typeParams?: LuaTypeParameterDeclaration | UnhandledElement;
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
