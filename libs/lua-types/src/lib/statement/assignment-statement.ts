import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaExpression, LuaLVal } from '../lua-nodes.types';

export interface AssignmentStatement extends BaseLuaNode {
  type: 'AssignmentStatement';
  identifiers: LuaLVal[];
  values: LuaExpression[];
}

export const assignmentStatement = (
  identifiers: LuaLVal[],
  values: LuaExpression[]
): AssignmentStatement => ({
  type: 'AssignmentStatement',
  identifiers,
  values,
});

export const isAssignmentStatement = isNodeType<AssignmentStatement>(
  'AssignmentStatement'
);
