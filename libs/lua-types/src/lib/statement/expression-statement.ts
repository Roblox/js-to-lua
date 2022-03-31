import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaNodeGroup } from './node-group';
import { LuaCallExpression } from '../expression';

export interface LuaExpressionStatement extends BaseLuaNode {
  type: 'ExpressionStatement';
  expression: LuaCallExpression | LuaNodeGroup;
}

export const expressionStatement = (
  expression: LuaExpressionStatement['expression']
): LuaExpressionStatement => ({
  type: 'ExpressionStatement',
  expression,
});

export const isExpressionStatement = isNodeType<LuaExpressionStatement>(
  'ExpressionStatement'
);
