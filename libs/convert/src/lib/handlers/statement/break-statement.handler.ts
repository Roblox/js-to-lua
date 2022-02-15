import { createHandler } from '@js-to-lua/handler-utils';
import { breakStatement, LuaStatement } from '@js-to-lua/lua-types';
import { BreakStatement } from '@babel/types';

export const createBreakStatementHandler = () =>
  createHandler<LuaStatement, BreakStatement>('BreakStatement', () =>
    breakStatement()
  );
