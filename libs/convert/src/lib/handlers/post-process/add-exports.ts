import {
  LuaProgram,
  returnStatement,
  tableConstructor,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { exportsIdentifier } from './common-identifiers';

export function addExports(program: LuaProgram): LuaProgram {
  return program.extras?.doesExport
    ? {
        ...program,
        body: [
          variableDeclaration(
            [variableDeclaratorIdentifier(exportsIdentifier)],
            [variableDeclaratorValue(tableConstructor())]
          ),
          ...program.body,
          returnStatement(exportsIdentifier),
        ],
      }
    : program;
}
