import { LuaComment } from '@js-to-lua/lua-types';

export const appendComments = (
  comments?: ReadonlyArray<LuaComment>,
  toAppend?: ReadonlyArray<LuaComment>
): LuaComment[] | undefined =>
  comments || toAppend ? [...(comments || []), ...(toAppend || [])] : undefined;
