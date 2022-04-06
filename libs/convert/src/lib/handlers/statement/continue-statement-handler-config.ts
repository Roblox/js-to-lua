import { EmptyConfig } from '@js-to-lua/handler-utils';
import { LuaStatement } from '@js-to-lua/lua-types';

export type ContinueStatementHandlerConfig<C = EmptyConfig> = C & {
  continueUpdateStatements?: LuaStatement[];
};

export const withContinueStatementHandlerConfig = <C extends EmptyConfig>(
  statements: LuaStatement[],
  config: C
): ContinueStatementHandlerConfig<C> => ({
  ...config,
  continueUpdateStatements: statements,
});
