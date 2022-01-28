import { BaseLuaNode, isNodeType } from './node.types';

export interface UnhandledStatement extends BaseLuaNode {
  type: 'UnhandledStatement';
}

export interface UnhandledExpression extends BaseLuaNode {
  type: 'UnhandledExpression';
}

export interface UnhandledElement extends BaseLuaNode {
  type: 'UnhandledElement';
}

export const unhandledStatement = (): UnhandledStatement => ({
  type: 'UnhandledStatement',
});

export const unhandledExpression = (): UnhandledExpression => ({
  type: 'UnhandledExpression',
});

export const unhandledElement = (): UnhandledElement => ({
  type: 'UnhandledElement',
});

export const isUnhandledExpression = isNodeType<UnhandledExpression>(
  'UnhandledExpression'
);

export const isUnhandledStatement =
  isNodeType<UnhandledStatement>('UnhandledStatement');

export const isUnhandledElement =
  isNodeType<UnhandledElement>('UnhandledElement');
