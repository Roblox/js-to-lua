import { LuaNode } from '@js-to-lua/lua-types';
import { curry } from 'ramda';
import { NonCurriedOptionalHandlerFunction } from './inner-types';
import {
  BabelNode,
  ConfigBase,
  EmptyConfig,
  OptionalHandlerFunction,
  OptionalHandlerFunctionSymbol,
} from './types';

export const createOptionalHandlerFunction = <
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
>(
  func: NonCurriedOptionalHandlerFunction<R, T, Config>
): OptionalHandlerFunction<R, T, Config> =>
  Object.assign(
    curry(function (source: string, config: Config, node: T): R | undefined {
      return func(source, config, node) ?? undefined;
    }),
    {
      [OptionalHandlerFunctionSymbol]: true as const,
    }
  );
