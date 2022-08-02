import { LuaNode } from '@js-to-lua/lua-types';

export const hasAnyComment = (node: LuaNode): boolean =>
  !!node.leadingComments?.length ||
  !!node.trailingComments?.length ||
  !!node.innerComments?.length;
