import { createHandler } from '@js-to-lua/handler-utils';
import { continueStatement, LuaStatement } from '@js-to-lua/lua-types';
import { ContinueStatement } from '@babel/types';

export const createContinueStatementHandler = () =>
  createHandler<LuaStatement, ContinueStatement>('ContinueStatement', () =>
    continueStatement()
  );
