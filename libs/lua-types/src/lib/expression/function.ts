import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaNodeGroup, nodeGroup } from '../statement';
import { LuaFunctionReturnType, functionReturnType, LuaType } from '../type';
import { LuaIdentifier } from './identifier';

// TODO: Pattern | RestElement | TSParameterProperty should be added in the future when handled
export type LuaFunctionParam = LuaIdentifier;

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
