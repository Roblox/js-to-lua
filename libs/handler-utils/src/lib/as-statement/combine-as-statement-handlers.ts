import { LuaExpression, LuaStatement } from '@js-to-lua/lua-types';
import { BaseNodeAsStatementHandler } from './base-node-handler';
import { createAsStatementHandlerFunction } from './create-as-statement-handler-function';
import { NonCurriedAsStatementHandlerFunction } from '../inner-types';
import { BabelNode, ConfigBase, EmptyConfig } from '../types';
import { AsStatementHandlerFunction } from './handler-function';

export const combineAsStatementHandlers = <
  R extends LuaStatement,
  T extends BabelNode = BabelNode,
  I extends LuaExpression = LuaExpression,
  Config extends ConfigBase = EmptyConfig
>(
  ons: BaseNodeAsStatementHandler<R, T, I, Config>[],
  fallback: AsStatementHandlerFunction<R, T, I, Config>
): BaseNodeAsStatementHandler<R, T, I, Config> => {
  return {
    type: ons.map(({ type }) => type).flat(),
    handler: createAsStatementHandlerFunction<R, T, I, Config>(
      (source, config, node) => {
        const handler =
          ons.find((on) => {
            const types = Array.isArray(on.type) ? on.type : [on.type];
            return types.includes(node.type);
          })?.handler || fallback;

        return (handler as NonCurriedAsStatementHandlerFunction<R, T, I>)(
          source,
          config,
          node
        ); // TODO fix typing error
      },
      { skipComments: true }
    ),
  } as BaseNodeAsStatementHandler<R, T, I, Config>;
};
