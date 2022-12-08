import {
  hasNeedsRegExpExtra,
  packagesIdentifier,
  prependProgram,
  regexpIdentifier,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  memberExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { ProcessProgramFunction } from '@js-to-lua/plugin-utils';

export const addRegExpImport: ProcessProgramFunction = (program) =>
  hasNeedsRegExpExtra(program)
    ? prependProgram(
        [
          variableDeclaration(
            [variableDeclaratorIdentifier(regexpIdentifier)],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  memberExpression(packagesIdentifier, '.', regexpIdentifier),
                ])
              ),
            ]
          ),
        ],
        program
      )
    : program;
