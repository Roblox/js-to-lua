import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  identifier,
  numericLiteral,
  program,
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';
import { handleProgram } from './program.handler';

const source = '';

describe('Program handler', () => {
  describe('Numeric', () => {
    it('should handle numeric expressions', () => {
      const given = getProgramNode(`
      foo = 1;
      foo = 2;
      foo = 34;
    `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [numericLiteral(1, '1')]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [numericLiteral(2, '2')]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [numericLiteral(34, '34')]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
