import { BabelNode, BaseNodeHandler, HandlerFunction } from '../types';
import { LuaNode } from '@js-to-lua/lua-types';

export const forwardHandlerRef = <
  T extends BabelNode = BabelNode,
  R extends LuaNode = LuaNode
>(
  handleFactory: () => BaseNodeHandler<T, R>
): HandlerFunction<T, R> => (...args) => handleFactory().handler(...args);
