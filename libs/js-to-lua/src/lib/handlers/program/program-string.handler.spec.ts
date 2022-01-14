import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  identifier,
  LuaProgram,
  program,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';
import { handleProgram } from './program.handler';

const source = '';

describe('Program handler', () => {
  describe('String', () => {
    it('should handle string expressions', () => {
      const given = getProgramNode(`
        foo = "1"
        foo = "2"
        foo = "34"
      `);
      const expected: LuaProgram = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [stringLiteral('1')]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [stringLiteral('2')]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [stringLiteral('34')]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
