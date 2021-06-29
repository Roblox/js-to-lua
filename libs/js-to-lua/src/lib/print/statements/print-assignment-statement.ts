import { AssignmentStatement, LuaNode } from '@js-to-lua/lua-types';

export const createPrintAssignmentStatement = (
  printNode: (node: LuaNode) => string
) => (node: AssignmentStatement): string => {
  const identifiers = node.identifiers.map((id) => printNode(id)).join(', ');
  const initializers = node.values.map((value) => printNode(value)).join(', ');
  return [identifiers, initializers].filter(Boolean).join(' = ');
};
