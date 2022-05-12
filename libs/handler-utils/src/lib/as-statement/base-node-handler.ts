import { LuaExpression, LuaStatement } from '@js-to-lua/lua-types';
import { BabelNode, ConfigBase, EmptyConfig } from '../types';
import { AsStatementHandlerFunction } from './handler-function';

export const BaseNodeAsStatementHandlerSymbol = Symbol(
  'BaseNodeAsStatementHandler'
);

export interface BaseNodeAsStatementHandler<
  R extends LuaStatement = LuaStatement,
  T extends BabelNode = BabelNode,
  I extends LuaExpression = LuaExpression,
  Config extends ConfigBase = EmptyConfig
> {
  [BaseNodeAsStatementHandlerSymbol]: true;
  type: T['type'] | T['type'][];
  handler: AsStatementHandlerFunction<R, T, I, Config>;
}
