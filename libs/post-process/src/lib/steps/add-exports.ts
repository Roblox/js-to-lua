import {
  appendProgram,
  exportsIdentifier,
  isWithExportsExtras,
  prependProgram,
} from '@js-to-lua/lua-conversion-utils';
import {
  returnStatement,
  tableConstructor,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { ProcessProgramFunction } from '@js-to-lua/plugin-utils';
import { pipe } from 'ramda';

export const addExports: ProcessProgramFunction = (program) => {
  const prependExportsDeclaration = prependProgram([
    variableDeclaration(
      [variableDeclaratorIdentifier(exportsIdentifier)],
      [variableDeclaratorValue(tableConstructor())]
    ),
  ]);
  const appendExportsReturn = appendProgram([
    returnStatement(exportsIdentifier),
  ]);
  return isWithExportsExtras(program)
    ? pipe(prependExportsDeclaration, appendExportsReturn)(program)
    : program;
};
