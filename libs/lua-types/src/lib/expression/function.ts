import { LuaExpression } from './expression';
import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaIdentifier } from './identifier';
import { LuaNodeGroup, LuaStatement, nodeGroup } from '../statement';
import { LuaTypeAnnotation } from '../type';

// TODO: Pattern | RestElement | TSParameterProperty should be added in the future when handled
export type LuaFunctionParam = LuaIdentifier;

export interface LuaFunctionExpression extends BaseLuaNode {
  type: 'FunctionExpression';
  params: Array<LuaFunctionParam>;
  body: LuaNodeGroup<LuaStatement | LuaExpression>;
  returnType?: LuaTypeAnnotation;
}

export const functionExpression = (
  params: LuaFunctionExpression['params'] = [],
  body: LuaFunctionExpression['body'] = nodeGroup([]),
  returnType: LuaFunctionExpression['returnType'] = undefined
): LuaFunctionExpression => {
  if (returnType) {
    return {
      type: 'FunctionExpression',
      params,
      body,
      returnType,
    };
  }
  return {
    type: 'FunctionExpression',
    params,
    body,
  };
};

export const isFunctionExpression =
  isNodeType<LuaFunctionExpression>('FunctionExpression');
