import { isWithExportsExtras } from '@js-to-lua/lua-conversion-utils';
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
  return isWithExportsExtras(program)
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
