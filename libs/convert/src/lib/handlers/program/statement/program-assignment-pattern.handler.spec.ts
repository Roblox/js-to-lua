import {
  binaryExpression,
  elseExpressionClause,
  functionDeclaration,
  identifier,
  ifElseExpression,
  ifExpressionClause,
  nilLiteral,
  nodeGroup,
  typeAnnotation,
  typeAny,
  typeOptional,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../convert-program';

import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

const source = '';
describe('Program handler', () => {
  describe('Assignment Pattern Handler', () => {
    it(`should handle AssignmentPattern `, () => {
      const given = getProgramNode(`
        function func(foo = bar) {}
      `);
      const expected = programWithUpstreamComment([
        functionDeclaration(
          identifier('func'),
          [identifier('foo_', typeAnnotation(typeOptional(typeAny())))],
          nodeGroup([
            variableDeclaration(
              [
                variableDeclaratorIdentifier(
                  identifier('foo', typeAnnotation(typeAny()))
                ),
              ],
              [
                variableDeclaratorValue(
                  ifElseExpression(
                    ifExpressionClause(
                      binaryExpression(identifier('foo_'), '~=', nilLiteral()),
                      identifier('foo_')
                    ),
                    elseExpressionClause(identifier('bar'))
                  )
                ),
              ]
            ),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });
});
