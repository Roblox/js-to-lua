import { LuaExpression, LuaStatement } from '@js-to-lua/lua-types';
import {
  BaseNodeAsStatementHandler,
  BaseNodeAsStatementHandlerSymbol,
  createAsStatementHandlerFunction,
} from './as-statement';
import { CreateHandlerFunctionOptions } from './create-handler-function';
import { NonCurriedAsStatementHandlerFunction } from './inner-types';
import { BabelNode, ConfigBase, EmptyConfig } from './types';

export const createAsStatementHandler = <
  R extends LuaStatement,
  T extends BabelNode,
  I extends LuaExpression = LuaExpression,
  Config extends ConfigBase = EmptyConfig
>(
  type: BaseNodeAsStatementHandler<R, T, I, Config>['type'],
  handler: NonCurriedAsStatementHandlerFunction<R, T, I, Config>,
  handleConfig: CreateHandlerFunctionOptions = {}
): BaseNodeAsStatementHandler<R, T, I, Config> => ({
  [BaseNodeAsStatementHandlerSymbol]: true,
  type,
  handler: createAsStatementHandlerFunction(
    (source, config: Config, node: T): ReturnType<typeof handler> =>
      handler(source, config, node),
    handleConfig
  ),
});
