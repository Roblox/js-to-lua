import { LuaNode } from '@js-to-lua/lua-types';
import { BabelNode, ConfigBase, EmptyConfig } from './types';

export type NonCurriedHandlerFunction<
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
> = (source: string, config: Config, node: T) => R;

export type NonCurriedOptionalHandlerFunction<
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
> = (source: string, config: Config, node: T) => R | undefined | void;
