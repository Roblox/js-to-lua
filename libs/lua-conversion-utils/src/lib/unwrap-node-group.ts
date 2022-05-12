import { isNodeGroup, LuaNodeGroup, LuaStatement } from '@js-to-lua/lua-types';

export const unwrapNodeGroup = <T extends LuaStatement>(
  nodeGroup: LuaNodeGroup<T>
): LuaNodeGroup<T> | T =>
  nodeGroup.body.length === 1 ? nodeGroup.body[0] : nodeGroup;

export const unwrapStatement = (nodeGroup: LuaStatement): LuaStatement =>
  isNodeGroup(nodeGroup)
    ? nodeGroup.body.length === 1
      ? nodeGroup.body[0]
      : nodeGroup
    : nodeGroup;

export const unwrapStatements = (nodeGroup: LuaStatement): LuaStatement[] =>
  isNodeGroup(nodeGroup) ? nodeGroup.body : [nodeGroup];
