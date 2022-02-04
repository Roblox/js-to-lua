import { Node } from '@babel/types';
import { LuaNode } from '@js-to-lua/lua-types';
import { F } from 'ts-toolbelt';

export type EmptyConfig = Record<never, unknown>;
export type ConfigBase = Record<string, any>;

export type BabelNode = Pick<
  Node,
  | 'type'
  | 'start'
  | 'end'
  | 'leadingComments'
  | 'innerComments'
  | 'trailingComments'
  | 'loc'
>;

export type HandlerFunction<
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
> = F.Curry<(source: string, config: Config, node: T) => R>;

export type OptionalHandlerFunction<
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
> = F.Curry<(source: string, config: Config, node: T) => R | undefined>;

export interface BaseNodeHandler<
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
> {
  type: T['type'] | T['type'][];
  handler: HandlerFunction<R, T, Config>;
}
