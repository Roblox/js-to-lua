import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  identifier,
  nodeGroup,
  numericLiteral,
  program,
} from '@js-to-lua/lua-types';
import { handleProgram } from './program.handler';
import { getProgramNode } from './program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Update expression', () => {
    it('should handle prefix increment operator as expression statement', () => {
      const given = getProgramNode(`
        ++foo;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.ADD,
          [identifier('foo')],
          [numericLiteral(1)]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle suffix increment operator as expression statement', () => {
      const given = getProgramNode(`
        foo++;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.ADD,
          [identifier('foo')],
          [numericLiteral(1)]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle prefix decrement operator as expression statement', () => {
      const given = getProgramNode(`
        --foo;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.SUB,
          [identifier('foo')],
          [numericLiteral(1)]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle suffix decrement operator as expression statement', () => {
      const given = getProgramNode(`
        foo--;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.SUB,
          [identifier('foo')],
          [numericLiteral(1)]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle prefix increment operator', () => {
      const given = getProgramNode(`
        a = ++foo;
      `);
      const expected = program([
        nodeGroup([
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('foo')],
            [numericLiteral(1)]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('a')],
            [identifier('foo')]
          ),
        ]),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle suffix increment operator', () => {
      const given = getProgramNode(`
        a = foo++;
      `);
      const expected = program([
        nodeGroup([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('a')],
            [identifier('foo')]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('foo')],
            [numericLiteral(1)]
          ),
        ]),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle prefix decrement operator', () => {
      const given = getProgramNode(`
        a = --foo;
      `);
      const expected = program([
        nodeGroup([
          assignmentStatement(
            AssignmentStatementOperatorEnum.SUB,
            [identifier('foo')],
            [numericLiteral(1)]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('a')],
            [identifier('foo')]
          ),
        ]),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle suffix decrement operator', () => {
      const given = getProgramNode(`
        a = foo--;
      `);
      const expected = program([
        nodeGroup([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('a')],
            [identifier('foo')]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.SUB,
            [identifier('foo')],
            [numericLiteral(1)]
          ),
        ]),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
