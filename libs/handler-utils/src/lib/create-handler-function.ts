import { LuaNode } from '@js-to-lua/lua-types';
import { curry } from 'ramda';
import { handleComments } from './handle-comments';
import { NonCurriedHandlerFunction } from './inner-types';
import { BabelNode, ConfigBase, EmptyConfig, HandlerFunction } from './types';

export const createHandlerFunction = <
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
>(
  func: NonCurriedHandlerFunction<R, T, Config>
): HandlerFunction<R, T, Config> =>
  curry(function (source: string, config: Config, node: T): R {
    return handleComments(source, node, func(source, config, node));
  });
