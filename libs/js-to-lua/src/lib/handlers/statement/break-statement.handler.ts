import { createHandler } from '../../types';
import { breakStatement, LuaStatement } from '@js-to-lua/lua-types';
import { BreakStatement } from '@babel/types';

export const createBreakStatementHandler = () =>
  createHandler<LuaStatement, BreakStatement>('BreakStatement', () =>
    breakStatement()
  );
