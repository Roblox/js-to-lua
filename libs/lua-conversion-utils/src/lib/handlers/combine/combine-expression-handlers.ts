import {
  BabelNode,
  BaseNodeHandler,
  combineHandlers,
  ConfigBase,
  EmptyConfig,
} from '@js-to-lua/handler-utils';
import { LuaExpression } from '@js-to-lua/lua-types';
import { defaultExpressionHandler } from '../default';

export const combineExpressionsHandlers = <
  R extends LuaExpression = LuaExpression,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
>(
  ons: BaseNodeHandler<R, T, Config>[]
): BaseNodeHandler<R, T, Config> =>
  combineHandlers<R, T, Config>(ons, defaultExpressionHandler);
