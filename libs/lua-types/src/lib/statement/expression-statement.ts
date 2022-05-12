import { LuaCallExpression } from '../expression';
import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaExpressionStatement extends BaseLuaNode {
  type: 'ExpressionStatement';
  expression: LuaCallExpression;
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
