import { Node } from '@babel/types';
import { LuaNode } from '@js-to-lua/lua-types';
import { F } from 'ts-toolbelt';
import { curry } from 'ramda';

export interface BabelNode {
  type: Node['type'];
  start: number | null;
  end: number | null;
}

export type HandlerFunction<
  T extends BabelNode = BabelNode,
  R extends LuaNode = LuaNode
> = F.Curry<(source: string, node: T) => R>;

export interface BaseNodeHandler<
  T extends BabelNode = BabelNode,
  R extends LuaNode = LuaNode
> {
  type: T['type'] | T['type'][];
  handler: HandlerFunction<T, R>;
}

type NonCurriedHandlerFunction<
  T extends BabelNode = BabelNode,
  R extends LuaNode = LuaNode
> = (source: string, node: T) => R;

export const createHandlerFunction = <
  T extends BabelNode = BabelNode,
  R extends LuaNode = LuaNode
>(
  func: NonCurriedHandlerFunction<T, R>
): HandlerFunction<T, R> =>
  curry(function (source: string, node: T): R {
    return func(source, node);
  });

export const createHandler = <
  T extends BabelNode = BabelNode,
  R extends LuaNode = LuaNode
>(
  type: T['type'],
  handler: NonCurriedHandlerFunction<T, R>
): BaseNodeHandler<T, R> => ({
  type,
  handler: createHandlerFunction(function (source, node: T): R {
    return handler(source, node);
  }),
});
