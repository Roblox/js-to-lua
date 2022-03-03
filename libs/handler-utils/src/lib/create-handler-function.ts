import { LuaNode } from '@js-to-lua/lua-types';
import { curry } from 'ramda';
import { handleComments } from './handle-comments';
import { NonCurriedHandlerFunction } from './inner-types';
import { BabelNode, ConfigBase, EmptyConfig, HandlerFunction } from './types';

interface CreateHandlerFunctionOptions {
  skipComments?: boolean;
}

export const createHandlerFunction = <
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
>(
  func: NonCurriedHandlerFunction<R, T, Config>,
  { skipComments = false }: CreateHandlerFunctionOptions = {}
): HandlerFunction<R, T, Config> =>
  curry(function (source: string, config: Config, node: T): R {
    const luaNode = func(source, config, node);
    return skipComments ? luaNode : handleComments(source, node, luaNode);
  });
