import {
  hasNeedsPromiseExtra,
  packagesIdentifier,
  prependProgram,
  promiseIdentifier,
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

export const addPromiseImport: ProcessProgramFunction = (program) =>
  hasNeedsPromiseExtra(program)
    ? prependProgram(
        [
          variableDeclaration(
            [variableDeclaratorIdentifier(promiseIdentifier)],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  memberExpression(packagesIdentifier, '.', promiseIdentifier),
                ])
              ),
            ]
          ),
        ],
        program
      )
    : program;
