import {
  BabelNode,
  BaseNodeHandler,
  ConfigBase,
  createHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '../types';
import {
  defaultExpressionHandler,
  defaultStatementHandler,
  defaultTypeAnnotationHandler,
} from './default-handlers';
import {
  LuaExpression,
  LuaNode,
  LuaStatement,
  LuaTypeAnnotation,
} from '@js-to-lua/lua-types';

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

export const combineStatementHandlers = <
  R extends LuaStatement = LuaStatement,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
>(
  ons: BaseNodeHandler<R, T, Config>[]
): BaseNodeHandler<R, T, Config> =>
  combineHandlers<R, T, Config>(ons, defaultStatementHandler);

export const combineExpressionsHandlers = <
  R extends LuaExpression = LuaExpression,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
>(
  ons: BaseNodeHandler<R, T, Config>[]
): BaseNodeHandler<R, T, Config> =>
  combineHandlers<R, T, Config>(ons, defaultExpressionHandler);

export const combineTypeAnnotationHandlers = <
  R extends LuaTypeAnnotation = LuaTypeAnnotation,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
>(
  ons: BaseNodeHandler<R, T, Config>[]
): BaseNodeHandler<R, T, Config> =>
  combineHandlers<R, T, Config>(ons, defaultTypeAnnotationHandler);
