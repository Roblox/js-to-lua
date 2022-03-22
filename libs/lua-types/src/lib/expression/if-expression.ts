import { LuaExpression } from './expression';
import { BaseLuaNode, isNodeType } from '../node.types';

export interface LuaIfExpression extends BaseLuaNode {
  type: 'IfExpression';
  ifClause: LuaIfExpressionClause;
  elseifClauses?: LuaElseifExpressionClause[];
  elseClause: LuaElseExpressionClause;
}

export interface LuaIfExpressionClause extends BaseLuaNode {
  type: 'IfExpressionClause';
  condition: LuaExpression;
  body: LuaExpression;
}

export interface LuaElseifExpressionClause extends BaseLuaNode {
  type: 'ElseifExpressionClause';
  condition: LuaExpression;
  body: LuaExpression;
}

export interface LuaElseExpressionClause extends BaseLuaNode {
  type: 'ElseExpressionClause';
  body: LuaExpression;
}

export type LuaExpressionClause =
  | LuaIfExpressionClause
  | LuaElseifExpressionClause
  | LuaElseExpressionClause;

export const ifElseExpression = (
  ifClause: LuaIfExpression['ifClause'],
  elseClause: LuaIfExpression['elseClause']
): LuaIfExpression => ({
  type: 'IfExpression',
  ifClause,
  elseClause,
});

export const ifExpression = (
  ifClause: LuaIfExpression['ifClause'],
  elseifClauses: LuaIfExpression['elseifClauses'],
  elseClause: LuaIfExpression['elseClause']
): LuaIfExpression => ({
  type: 'IfExpression',
  ifClause,
  ...(elseifClauses && elseifClauses.length ? { elseifClauses } : {}),
  elseClause,
});

export const ifExpressionClause = (
  condition: LuaIfExpressionClause['condition'],
  body: LuaIfExpressionClause['body']
): LuaIfExpressionClause => ({
  type: 'IfExpressionClause',
  condition,
  body,
});

export const elseifExpressionClause = (
  condition: LuaElseifExpressionClause['condition'],
  body: LuaElseifExpressionClause['body']
): LuaElseifExpressionClause => ({
  type: 'ElseifExpressionClause',
  condition,
  body,
});

export const elseExpressionClause = (
  body: LuaElseExpressionClause['body']
): LuaElseExpressionClause => ({
  type: 'ElseExpressionClause',
  body,
});

export const isIfExpression = isNodeType<LuaIfExpression>('IfExpression');

export const isIfExpressionClause =
  isNodeType<LuaIfExpressionClause>('IfExpressionClause');

export const isElseifExpressionClause = isNodeType<LuaElseifExpressionClause>(
  'ElseifExpressionClause'
);

export const isElseExpressionClause = isNodeType<LuaElseExpressionClause>(
  'ElseExpressionClause'
);
