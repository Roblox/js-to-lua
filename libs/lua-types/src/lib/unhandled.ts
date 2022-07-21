import { BaseLuaNode, isNodeType } from './node.types';

export interface UnhandledStatement extends BaseLuaNode {
  type: 'UnhandledStatement';
}

export interface UnhandledExpression extends BaseLuaNode {
  type: 'UnhandledExpression';
}

export const unhandledStatement = (): UnhandledStatement => ({
  type: 'UnhandledStatement',
});

export const unhandledExpression = (): UnhandledExpression => ({
  type: 'UnhandledExpression',
});

export const isUnhandledExpression = isNodeType<UnhandledExpression>(
  'UnhandledExpression'
);

export const isUnhandledStatement =
  isNodeType<UnhandledStatement>('UnhandledStatement');
