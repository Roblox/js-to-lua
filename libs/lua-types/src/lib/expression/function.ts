import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaNodeGroup, nodeGroup } from '../statement';
import { functionReturnType, LuaFunctionReturnType, LuaType } from '../type';
import { LuaFunctionParam } from './function-param';

export interface LuaFunctionExpression extends BaseLuaNode {
  type: 'FunctionExpression';
  params: Array<LuaFunctionParam>;
  body: LuaNodeGroup;
  returnType?: LuaFunctionReturnType;
}

export const functionExpression = (
  params: LuaFunctionExpression['params'] = [],
  body: LuaFunctionExpression['body'] = nodeGroup([]),
  returnType?: LuaType
): LuaFunctionExpression => ({
  type: 'FunctionExpression',
  params,
  body,
  returnType: returnType ? functionReturnType([returnType]) : undefined,
});

export const functionExpressionMultipleReturn = (
  params: LuaFunctionExpression['params'] = [],
  body: LuaFunctionExpression['body'] = nodeGroup([]),
  returnType: LuaFunctionExpression['returnType']
): LuaFunctionExpression => ({
  type: 'FunctionExpression',
  params,
  body,
  returnType,
});

export const isFunctionExpression =
  isNodeType<LuaFunctionExpression>('FunctionExpression');
