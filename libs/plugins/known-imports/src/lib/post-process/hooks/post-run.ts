import { visit } from '@js-to-lua/lua-conversion-utils';
import { LuaExpression } from '@js-to-lua/lua-types';
import { ProcessProgramFunction } from '@js-to-lua/plugin-utils';
import { identity } from 'ramda';
import { knownRequiresHandlers } from '../../handlers';
import { isRequire, RequireCall } from '../../utils';

const handleKnownRequire = (node: RequireCall): LuaExpression => {
  const { value } = knownRequiresHandlers.find(({ test }) => test(node)) || {
    value: identity,
  };

  return value(node);
};
export const postRun: ProcessProgramFunction = (program) => {
  visit(program, (node) => {
    if (isRequire(node)) {
      const newRequire = handleKnownRequire(node);

      if (newRequire !== node) {
        return newRequire;
      }
    }
  });
  return program;
};
