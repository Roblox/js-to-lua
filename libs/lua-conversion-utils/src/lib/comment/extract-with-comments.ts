import { LuaNode } from '@js-to-lua/lua-types';
import { reassignComments } from './reassign-comments';

export const extractWithComments = <T extends LuaNode, R extends LuaNode>(
  baseNode: T,
  extractFn: (base: T) => R
): R => {
  const extracted = extractFn(baseNode);
  return reassignComments(extracted, baseNode);
};
