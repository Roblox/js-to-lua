import { LuaComment } from '@js-to-lua/lua-types';

export const prependComments = (
  comments?: ReadonlyArray<LuaComment>,
  toPrepend?: ReadonlyArray<LuaComment>
): LuaComment[] | undefined =>
  comments || toPrepend
    ? [...(toPrepend || []), ...(comments || [])]
    : undefined;
