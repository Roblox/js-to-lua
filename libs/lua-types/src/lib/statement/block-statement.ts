import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaStatement } from '../lua-nodes.types';

export interface LuaBlockStatement extends BaseLuaNode {
  type: 'BlockStatement';
  body: LuaStatement[];
}

export const blockStatement = (
  body: LuaBlockStatement['body']
): LuaBlockStatement => ({
  type: 'BlockStatement',
  body,
});

export const isBlockStatement = isNodeType<LuaBlockStatement>('BlockStatement');
