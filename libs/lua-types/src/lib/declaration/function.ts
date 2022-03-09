import { LuaFunctionParam, LuaIdentifier } from '../expression';
import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaNodeGroup, LuaStatement, nodeGroup } from '../statement';
import { LuaTypeAnnotation, LuaTypeParameterDeclaration } from '../type';
import { UnhandledElement } from '../unhandled';

export interface LuaFunctionDeclaration extends BaseLuaNode {
  type: 'FunctionDeclaration';
  id: LuaIdentifier;
  params: Array<LuaFunctionParam>;
  body: LuaNodeGroup<LuaStatement>;
  returnType?: LuaTypeAnnotation;
  isLocal: boolean;
  typeParams?: LuaTypeParameterDeclaration | UnhandledElement;
}

export const functionDeclaration = (
  id: LuaFunctionDeclaration['id'],
  params: LuaFunctionDeclaration['params'] = [],
  body: LuaFunctionDeclaration['body'] = nodeGroup([]),
  returnType: LuaFunctionDeclaration['returnType'] = undefined,
  isLocal: LuaFunctionDeclaration['isLocal'] = true,
  typeParams?: LuaFunctionDeclaration['typeParams']
): LuaFunctionDeclaration => {
  if (returnType) {
    return {
      type: 'FunctionDeclaration',
      id,
      typeParams,
      params,
      body,
      returnType,
      isLocal,
    };
  }
  return {
    type: 'FunctionDeclaration',
    id,
    typeParams,
    params,
    body,
    isLocal,
  };
};

export const isFunctionDeclaration = isNodeType<LuaFunctionDeclaration>(
  'FunctionDeclaration'
);
