import { unwrapNestedNodeGroups, visit } from '@js-to-lua/lua-conversion-utils';
import {
  isIdentifier,
  isNodeGroup,
  isVariableDeclaration,
} from '@js-to-lua/lua-types';
import { ProcessProgramFunction } from '@js-to-lua/plugin-utils';
import { isJestGlobal, withJestGlobalExtra } from '../../jest-global-extra';

export const preGather: ProcessProgramFunction = (program) => {
  const rootLevelDeclarations = program.body
    .map((statement) =>
      isNodeGroup(statement)
        ? unwrapNestedNodeGroups(statement).body
        : [statement]
    )
    .flat()
    .filter(isVariableDeclaration)
    .map((declaration) => declaration.identifiers.map((id) => id.value.name))
    .flat();

  visit(program, (node) => {
    if (isIdentifier(node) && isJestGlobal(node.name)) {
      if (!rootLevelDeclarations.includes(node.name)) {
        return withJestGlobalExtra(node.name)(node);
      }
    }
  });
  return program;
};
