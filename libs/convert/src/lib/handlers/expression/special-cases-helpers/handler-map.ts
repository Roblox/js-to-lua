import {
  BabelNode,
  ConfigBase,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { LuaNode } from '@js-to-lua/lua-types';

export type HandlerMap<
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig,
  K extends string = string
> = Record<K, HandlerFunction<R, T, Config>>;
