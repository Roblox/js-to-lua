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
  R extends LuaNode,
  T extends BabelNode = BabelNode
> = F.Curry<(source: string, node: T) => R>;

export interface BaseNodeHandler<
  R extends LuaNode,
  T extends BabelNode = BabelNode
> {
  type: T['type'] | T['type'][];
  handler: HandlerFunction<R, T>;
}

type NonCurriedHandlerFunction<
  R extends LuaNode,
  T extends BabelNode = BabelNode
> = (source: string, node: T) => R;

export const createHandlerFunction = <
  R extends LuaNode,
  T extends BabelNode = BabelNode
>(
  func: NonCurriedHandlerFunction<R, T>
): HandlerFunction<R, T> =>
  curry(function (source: string, node: T): R {
    return func(source, node);
  });

export const createHandler = <
  R extends LuaNode,
  T extends BabelNode = BabelNode
>(
  type: T['type'],
  handler: NonCurriedHandlerFunction<R, T>
): BaseNodeHandler<R, T> => ({
  type,
  handler: createHandlerFunction(function (source, node: T): R {
    return handler(source, node);
  }),
});
