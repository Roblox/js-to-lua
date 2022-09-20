import { LuaProgram, LuaStatement } from '@js-to-lua/lua-types';
import { curry } from 'ramda';

export const prependProgram = curry(
  (statements: LuaStatement[], program: LuaProgram): LuaProgram => ({
    ...program,
    body: [...statements, ...program.body],
  })
);
