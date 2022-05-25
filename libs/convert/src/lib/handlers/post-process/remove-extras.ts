import { visit } from '@js-to-lua/lua-conversion-utils';
import { LuaProgram } from '@js-to-lua/lua-types';

export function removeExtras(program: LuaProgram): LuaProgram {
  visit(program, (node) => {
    if (node.extras) {
      delete node.extras;
    }
  });
  return program;
}
