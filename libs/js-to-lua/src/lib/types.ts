import { Node } from '@babel/types';
import { LuaNode } from '@js-to-lua/lua-types';

export interface BabelNode {
  type: Node['type'];
  start: number | null;
  end: number | null;
}

export type HandlerFunction<
  T extends BabelNode = BabelNode,
  R extends LuaNode = LuaNode
> = (node: T) => R;

export interface BaseNodeHandler<
  T extends BabelNode = BabelNode,
  R extends LuaNode = LuaNode
> {
  type: T['type'] | T['type'][];
  handler: HandlerFunction<T, R>;
}
