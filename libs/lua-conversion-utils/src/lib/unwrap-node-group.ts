import { LuaNode, LuaNodeGroup } from '@js-to-lua/lua-types';

export const unwrapNodeGroup = <T extends LuaNode>(
  nodeGroup: LuaNodeGroup<T>
): LuaNodeGroup<T> | T =>
  nodeGroup.body.length === 1 ? nodeGroup.body[0] : nodeGroup;
