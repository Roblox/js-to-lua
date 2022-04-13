import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  identifier,
  LuaProgram,
  program,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { handleProgram } from './program.handler';
import { getProgramNode } from './program.spec.utils';

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

    it('should handle string expressions with unicode chars', () => {
      const given = getProgramNode(`
        foo = ' \\u203A ';
        foo = ' \\u2022 ';
        foo = ' \\u{203A} ';
        foo = ' \\u{2022} ';
        foo = '\\u{41}'
        foo = '\\u{5a}'
      `);

      const expected: LuaProgram = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [stringLiteral(' \u{203A} ', "' \\u{203A} '")]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [stringLiteral(' \u{2022} ', "' \\u{2022} '")]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [stringLiteral(' \u{203A} ', "' \\u{203A} '")]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [stringLiteral(' \u{2022} ', "' \\u{2022} '")]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [stringLiteral('\u{41}', "'\\u{41}'")]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [stringLiteral('\u{5a}', "'\\u{5a}'")]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
