import { visit } from '@js-to-lua/lua-conversion-utils';
import { BaseLuaNode, LuaProgram } from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { mergeDeepRight } from 'ramda';

export function gatherExtras(program: LuaProgram): LuaProgram {
  const extras = Array<BaseLuaNode['extras']>();
  visit(program, (node) => {
    if (node.extras) {
      extras.push(node.extras);
    }
  });

  return {
    ...program,
    ...(extras.length
      ? {
          extras: extras
            .filter(isTruthy)
            .reduce((gathered, e) => mergeDeepRight(gathered, e), {}),
        }
      : {}),
  };
}
