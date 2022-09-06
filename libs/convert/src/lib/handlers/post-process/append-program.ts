import { LuaProgram, LuaStatement } from '@js-to-lua/lua-types';
import { curry } from 'ramda';

export const appendProgram = curry(
  (statements: LuaStatement[], program: LuaProgram): LuaProgram => ({
    ...program,
    body: [...program.body, ...statements],
  })
);
