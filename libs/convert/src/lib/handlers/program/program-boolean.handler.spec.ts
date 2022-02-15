import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  booleanLiteral,
  identifier,
  program,
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';
import { handleProgram } from './program.handler';

const source = '';

describe('Program handler', () => {
  describe('Boolean', () => {
    it('should handle boolean expressions', () => {
      const given = getProgramNode(`
        foo = true
        foo = false
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [booleanLiteral(true)]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [booleanLiteral(false)]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
