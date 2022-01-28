import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaTypeAnnotation } from '../type';
import { LuaFunctionParam, LuaIdentifier } from '../expression';
import { LuaNodeGroup, LuaStatement, nodeGroup } from '../statement';

export interface LuaFunctionDeclaration extends BaseLuaNode {
  type: 'FunctionDeclaration';
  id: LuaIdentifier;
  params: Array<LuaFunctionParam>;
  body: LuaNodeGroup<LuaStatement>;
  returnType?: LuaTypeAnnotation;
  isLocal: boolean;
}

export const functionDeclaration = (
  id: LuaFunctionDeclaration['id'],
  params: LuaFunctionDeclaration['params'] = [],
  body: LuaFunctionDeclaration['body'] = nodeGroup([]),
  returnType: LuaFunctionDeclaration['returnType'] = undefined,
  isLocal: LuaFunctionDeclaration['isLocal'] = true
): LuaFunctionDeclaration => {
  if (returnType) {
    return {
      type: 'FunctionDeclaration',
      id,
      params,
      body,
      returnType,
      isLocal,
    };
  }
  return {
    type: 'FunctionDeclaration',
    id,
    params,
    body,
    isLocal,
  };
};

export const isFunctionDeclaration = isNodeType<LuaFunctionDeclaration>(
  'FunctionDeclaration'
);
