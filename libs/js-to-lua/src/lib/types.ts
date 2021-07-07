import { Node } from '@babel/types';
import { LuaNode } from '@js-to-lua/lua-types';
import { F } from 'ts-toolbelt';
import { curry } from 'ramda';

export type EmptyConfig = Record<never, unknown>;
export type ConfigBase = Record<string, any>;

export interface BabelNode {
  type: Node['type'];
  start: number | null;
  end: number | null;
}

export type HandlerFunction<
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
> = F.Curry<(source: string, config: Config, node: T) => R>;

export interface BaseNodeHandler<
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
> {
  type: T['type'] | T['type'][];
  handler: HandlerFunction<R, T, Config>;
}

type NonCurriedHandlerFunction<
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
> = (source: string, config: Config, node: T) => R;

export const createHandlerFunction = <
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
>(
  func: NonCurriedHandlerFunction<R, T, Config>
): HandlerFunction<R, T, Config> =>
  curry(function (source: string, config: Config, node: T): R {
    return func(source, config, node);
  });

export const createHandler = <
  R extends LuaNode,
  T extends BabelNode,
  Config extends ConfigBase = EmptyConfig
>(
  type: BaseNodeHandler<R, T, Config>['type'],
  handler: NonCurriedHandlerFunction<R, T, Config>
): BaseNodeHandler<R, T, Config> => ({
  type,
  handler: createHandlerFunction(function (source, config: Config, node: T): R {
    return handler(source, config, node);
  }),
});
