import { LuaProgram, LuaStatement } from '@js-to-lua/lua-types';

export function prependProgram(
  statements: LuaStatement[],
  program: LuaProgram
) {
  return {
    ...program,
    body: [...statements, ...program.body],
  };
}
