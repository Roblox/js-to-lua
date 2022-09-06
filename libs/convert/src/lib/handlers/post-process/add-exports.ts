import { isWithExportsExtras } from '@js-to-lua/lua-conversion-utils';
import {
  returnStatement,
  tableConstructor,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { pipe } from 'ramda';
import { appendProgram } from './append-program';
import { exportsIdentifier } from './common-identifiers';
import { prependProgram } from './prepend-program';
import { ProcessProgramFunction } from './types';

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
