import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  functionDeclaration,
  identifier,
  ifClause,
  ifStatement,
  nilLiteral,
  program,
  typeAnnotation,
  typeAny,
  typeOptional,
} from '@js-to-lua/lua-types';

import { getProgramNode } from '../program.spec.utils';
import { handleProgram } from '../program.handler';

const source = '';
describe('Program handler', () => {
  describe('Assignment Pattern Handler', () => {
    it(`should handle AssignmentPattern `, () => {
      const given = getProgramNode(`
        function func(foo = bar) {}
      `);
      const expected = program([
        functionDeclaration(
          identifier('func'),
          [identifier('foo', typeAnnotation(typeOptional(typeAny())))],
          [
            ifStatement(
              ifClause(
                binaryExpression(identifier('foo'), '==', nilLiteral()),
                [
                  assignmentStatement(
                    AssignmentStatementOperatorEnum.EQ,
                    [identifier('foo')],
                    [identifier('bar')]
                  ),
                ]
              )
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
