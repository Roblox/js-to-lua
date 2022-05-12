import { LuaExpression, LuaStatement } from '@js-to-lua/lua-types';
import { F } from 'ts-toolbelt';
import { BabelNode, ConfigBase, EmptyConfig } from '../types';
import { AsStatementReturnType } from './return-type';

export const AsStatementHandlerFunctionSymbol = Symbol(
  'AsStatementHandlerFunction'
);

export type AsStatementHandlerFunction<
  R extends LuaStatement = LuaStatement,
  T extends BabelNode = BabelNode,
  I extends LuaExpression = LuaExpression,
  Config extends ConfigBase = EmptyConfig
> = F.Curry<
  (source: string, config: Config, node: T) => AsStatementReturnType<R, I>
> & { [AsStatementHandlerFunctionSymbol]: true };
