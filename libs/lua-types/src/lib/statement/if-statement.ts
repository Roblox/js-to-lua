import { LuaExpression } from '../expression';
import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaNodeGroup } from './node-group';

export interface LuaIfStatement extends BaseLuaNode {
  type: 'LuaIfStatement';
  ifClause: LuaIfClause;
  elseifClauses?: LuaElseifClause[];
  elseClause?: LuaElseClause;
}

export interface LuaIfClause extends BaseLuaNode {
  type: 'IfClause';
  condition: LuaExpression;
  body: LuaNodeGroup;
}

export interface LuaElseifClause extends BaseLuaNode {
  type: 'ElseifClause';
  condition: LuaExpression;
  body: LuaNodeGroup;
}

export interface LuaElseClause extends BaseLuaNode {
  type: 'ElseClause';
  body: LuaNodeGroup;
}

export type LuaClause = LuaIfClause | LuaElseifClause | LuaElseClause;

export const ifStatement = (
  ifClause: LuaIfStatement['ifClause'],
  elseifClauses?: LuaIfStatement['elseifClauses'],
  elseClause?: LuaIfStatement['elseClause']
): LuaIfStatement => ({
  type: 'LuaIfStatement',
  ifClause,
  ...(elseifClauses && elseifClauses.length ? { elseifClauses } : {}),
  ...(elseClause ? { elseClause } : {}),
});

export const ifClause = (
  condition: LuaIfClause['condition'],
  body: LuaIfClause['body']
): LuaIfClause => ({
  type: 'IfClause',
  condition,
  body,
});

export const elseifClause = (
  condition: LuaElseifClause['condition'],
  body: LuaElseifClause['body']
): LuaElseifClause => ({
  type: 'ElseifClause',
  condition,
  body,
});

export const elseClause = (body: LuaElseClause['body']): LuaElseClause => ({
  type: 'ElseClause',
  body,
});

export const isIfStatement = isNodeType<LuaIfStatement>('LuaIfStatement');

export const isIfClause = isNodeType<LuaIfClause>('IfClause');

export const isElseifClause = isNodeType<LuaElseifClause>('ElseifClause');

export const isElseClause = isNodeType<LuaElseClause>('ElseClause');
