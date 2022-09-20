import {
  packagesIdentifier,
  prependProgram,
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
import { applyTo } from 'ramda';
import {
  getJestGlobals,
  jestGlobalsIdentifier,
  removeJestGlobalExtra,
} from '../../jest-global-extra';

export const preRun: ProcessProgramFunction = (program) => {
  const jestGlobals = getJestGlobals(program);

  return jestGlobals.length
    ? applyTo(
        prependProgram(
          [
            variableDeclaration(
              [variableDeclaratorIdentifier(jestGlobalsIdentifier)],
              [
                variableDeclaratorValue(
                  callExpression(identifier('require'), [
                    memberExpression(
                      memberExpression(
                        packagesIdentifier,
                        '.',
                        identifier('Dev')
                      ),
                      '.',
                      jestGlobalsIdentifier
                    ),
                  ])
                ),
              ]
            ),
            ...jestGlobals.map((key) =>
              variableDeclaration(
                [variableDeclaratorIdentifier(identifier(key))],
                [
                  variableDeclaratorValue(
                    memberExpression(
                      jestGlobalsIdentifier,
                      '.',
                      identifier(key)
                    )
                  ),
                ]
              )
            ),
          ],
          program
        ),
        (result) =>
          jestGlobals.reduce(
            (resultProgram, global) =>
              removeJestGlobalExtra(global, resultProgram),
            result
          )
      )
    : program;
};
