import {
  assignmentStatement,
  binaryExpression,
  functionDeclaration,
  identifier,
  ifStatement,
  nilLiteral,
  program,
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
          [identifier('foo')],
          [
            ifStatement(
              binaryExpression(identifier('foo'), '==', nilLiteral()),
              [assignmentStatement([identifier('foo')], [identifier('bar')])]
            ),
          ]
        ),
      ]);

      const actual = handleProgram.handler(source, given);
      expect(actual).toEqual(expected);
    });
  });
});
