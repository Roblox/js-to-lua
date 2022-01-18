import { LuaNode } from '@js-to-lua/lua-types';
import {
  BabelNode,
  ConfigBase,
  createOptionalHandlerFunction,
  EmptyConfig,
  OptionalHandlerFunction,
} from '../types';

export const combineOptionalHandlerFunctions = <
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
>(
  ons: OptionalHandlerFunction<R, T, Config>[]
): OptionalHandlerFunction<R, T, Config> =>
  createOptionalHandlerFunction<R, T, Config>((source, config, node) => {
    type F = (source: string, config: Config, node: T) => R | undefined;

    for (const on of ons) {
      const result = (on as F)(source, config, node); // TODO: fix typing error
      if (result) {
        return result;
      }
    }
    return undefined;
  });
