import { BabelNode, BaseNodeHandler, HandlerFunction } from '../types';
import { LuaNode } from '@js-to-lua/lua-types';

export const forwardHandlerRef =
  <R extends LuaNode, T extends BabelNode = BabelNode>(
    handleFactory: () => BaseNodeHandler<R, T>
  ): HandlerFunction<R, T> =>
  (...args) =>
    handleFactory().handler(...args);

export const forwardHandlerFunctionRef =
  <R extends LuaNode, T extends BabelNode = BabelNode>(
    handleFactory: () => HandlerFunction<R, T>
  ): HandlerFunction<R, T> =>
  (...args) =>
    handleFactory()(...args);
