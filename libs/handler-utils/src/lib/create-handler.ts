import { LuaNode } from '@js-to-lua/lua-types';
import {
  createHandlerFunction,
  CreateHandlerFunctionOptions,
} from './create-handler-function';
import { NonCurriedHandlerFunction } from './inner-types';
import { BabelNode, BaseNodeHandler, ConfigBase, EmptyConfig } from './types';

export const createHandler = <
  R extends LuaNode,
  T extends BabelNode,
  Config extends ConfigBase = EmptyConfig
>(
  type: BaseNodeHandler<R, T, Config>['type'],
  handler: NonCurriedHandlerFunction<R, T, Config>,
  handleConfig: CreateHandlerFunctionOptions = {}
): BaseNodeHandler<R, T, Config> => ({
  type,
  handler: createHandlerFunction(
    (source, config: Config, node: T): R => handler(source, config, node),
    handleConfig
  ),
});
