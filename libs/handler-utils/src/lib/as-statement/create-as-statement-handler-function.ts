import { LuaExpression, LuaStatement } from '@js-to-lua/lua-types';
import { curry } from 'ramda';
import { handleAsStatementResultComments } from '../handle-comments';
import { NonCurriedAsStatementHandlerFunction } from '../inner-types';
import { BabelNode, ConfigBase, EmptyConfig } from '../types';
import {
  AsStatementHandlerFunction,
  AsStatementHandlerFunctionSymbol,
} from './handler-function';
import { AsStatementReturnType } from './return-type';

export interface CreateAsStatementHandlerFunctionOptions {
  skipComments?: boolean;
}

export const createAsStatementHandlerFunction = <
  R extends LuaStatement,
  T extends BabelNode = BabelNode,
  I extends LuaExpression = LuaExpression,
  Config extends ConfigBase = EmptyConfig
>(
  func: NonCurriedAsStatementHandlerFunction<R, T, I, Config>,
  { skipComments = false }: CreateAsStatementHandlerFunctionOptions = {}
): AsStatementHandlerFunction<R, T, I, Config> =>
  Object.assign(
    curry(function (
      source: string,
      config: Config,
      node: T
    ): AsStatementReturnType<R, I> {
      const result = func(source, config, node);
      return skipComments
        ? result
        : handleAsStatementResultComments(source, node, result);
    }),
    {
      [AsStatementHandlerFunctionSymbol]: true as const,
    }
  );
