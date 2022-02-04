import { LuaNode } from '@js-to-lua/lua-types';
import { createHandlerFunction } from './create-handler-function';
import {
  BabelNode,
  BaseNodeHandler,
  ConfigBase,
  EmptyConfig,
  HandlerFunction,
} from './types';

export const combineHandlers = <
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
>(
  ons: BaseNodeHandler<R, T, Config>[],
  fallback: HandlerFunction<R, T, Config>
): BaseNodeHandler<R, T, Config> => {
  return {
    type: ons.map(({ type }) => type).flat(),
    handler: createHandlerFunction(
      (source: string, config: Config, node: T): R => {
        type F = (source: string, config: Config, node: T) => R;

        const handler =
          ons.find((on) => {
            const types = Array.isArray(on.type) ? on.type : [on.type];
            return types.includes(node.type);
          })?.handler || (fallback as HandlerFunction<R, T, Config>);

        return (handler as F)(source, config, node); // TODO fix typing error
      }
    ),
  } as BaseNodeHandler<R, T, Config>;
};
