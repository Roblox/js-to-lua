import { LuaExpression, LuaNode, LuaStatement } from '@js-to-lua/lua-types';
import { AsStatementReturnType } from './as-statement';
import { BabelNode, ConfigBase, EmptyConfig } from './types';

export type NonCurriedHandlerFunction<
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
> = (source: string, config: Config, node: T) => R;

export type NonCurriedOptionalHandlerFunction<
  R extends LuaNode,
  T extends BabelNode = BabelNode,
  Config extends ConfigBase = EmptyConfig
> = (source: string, config: Config, node: T) => R | undefined | void;

export type NonCurriedAsStatementHandlerFunction<
  R extends LuaStatement = LuaStatement,
  T extends BabelNode = BabelNode,
  I extends LuaExpression = LuaExpression,
  Config extends ConfigBase = EmptyConfig
> = (source: string, config: Config, node: T) => AsStatementReturnType<R, I>;
