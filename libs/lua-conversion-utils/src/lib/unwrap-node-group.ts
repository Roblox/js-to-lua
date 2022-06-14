import { isNodeGroup, LuaNodeGroup, LuaStatement } from '@js-to-lua/lua-types';

export const unwrapNodeGroup = <T extends LuaStatement>(
  nodeGroup: LuaNodeGroup<T>
): LuaNodeGroup<T> | T =>
  nodeGroup.body.length === 1 ? nodeGroup.body[0] : nodeGroup;

export const unwrapStatement = (statement: LuaStatement): LuaStatement =>
  isNodeGroup(statement)
    ? statement.body.length === 1
      ? statement.body[0]
      : statement
    : statement;

export const unwrapStatements = (nodeGroup: LuaStatement): LuaStatement[] =>
  isNodeGroup(nodeGroup) ? nodeGroup.body : [nodeGroup];
