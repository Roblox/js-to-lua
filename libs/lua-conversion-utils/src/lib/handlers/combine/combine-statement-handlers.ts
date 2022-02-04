import {
  BabelNode,
  BaseNodeHandler,
  combineHandlers,
  ConfigBase,
  EmptyConfig,
} from '@js-to-lua/handler-utils';
import { LuaStatement } from '@js-to-lua/lua-types';
import { defaultStatementHandler } from '../default';

export const combineStatementHandlers = <
  R extends LuaStatement = LuaStatement,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
>(
  ons: BaseNodeHandler<R, T, Config>[]
): BaseNodeHandler<R, T, Config> =>
  combineHandlers<R, T, Config>(ons, defaultStatementHandler);
