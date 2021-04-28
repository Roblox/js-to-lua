import { Node } from '@babel/types';
import { LuaNode } from './lua-nodes.types';

export interface BabelNode {
  type: Node['type'];
  start: number | null;
  end: number | null;
}

export interface BaseNodeHandler<
  T extends BabelNode = BabelNode,
  R extends LuaNode = LuaNode
> {
  type: T['type'] | T['type'][];
  handler: (node: T) => R;
}
