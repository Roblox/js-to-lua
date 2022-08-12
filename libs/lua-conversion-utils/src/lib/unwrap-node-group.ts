import { isNodeGroup, LuaNodeGroup, LuaStatement } from '@js-to-lua/lua-types';
import { reassignComments } from './comment';

export const unwrapNodeGroup = <T extends LuaStatement>(
  nodeGroup: LuaNodeGroup<T[]>
): LuaNodeGroup<T[]> | T =>
  nodeGroup.body.length === 1 ? nodeGroup.body[0] : nodeGroup;

export const unwrapNestedNodeGroups = (nodeGroup: LuaNodeGroup): LuaNodeGroup =>
  nodeGroup.body.length === 1 && isNodeGroup(nodeGroup.body[0])
    ? reassignComments(unwrapNestedNodeGroups(nodeGroup.body[0]), nodeGroup)
    : nodeGroup;

export const unwrapStatement = (statement: LuaStatement): LuaStatement =>
  isNodeGroup(statement) ? unwrapNodeGroup(statement) : statement;

export const unwrapStatements = (nodeGroup: LuaStatement): LuaStatement[] =>
  isNodeGroup(nodeGroup) ? nodeGroup.body : [nodeGroup];
