import { visit } from '@js-to-lua/lua-conversion-utils';
import { ProcessProgramFunction } from '@js-to-lua/plugin-utils';

export const removeExtras: ProcessProgramFunction = (program) => {
  visit(program, (node) => {
    if (node.extras) {
      delete node.extras;
    }
  });
  return program;
};
