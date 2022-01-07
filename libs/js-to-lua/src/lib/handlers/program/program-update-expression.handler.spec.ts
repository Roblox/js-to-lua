import { handleProgram } from './program.handler';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  expressionStatement,
  functionExpression,
  identifier,
  LuaProgram,
  numericLiteral,
  program,
  returnStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Update expression', () => {
    it('should handle prefix increment operator as expression statement', () => {
      const given = getProgramNode(`
     ++foo;
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('foo')],
            [numericLiteral(1)]
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle suffix increment operator as expression statement', () => {
      const given = getProgramNode(`
       foo++;
      `);
      const expected: LuaProgram = program([
        expressionStatement(
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('foo')],
            [numericLiteral(1)]
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle prefix decrement operator as expression statement', () => {
      const given = getProgramNode(`
       --foo;
      `);
      const expected: LuaProgram = program([
        expressionStatement(
          assignmentStatement(
            AssignmentStatementOperatorEnum.SUB,
            [identifier('foo')],
            [numericLiteral(1)]
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle suffix decrement operator as expression statement', () => {
      const given = getProgramNode(`
         foo--;
        `);
      const expected: LuaProgram = program([
        expressionStatement(
          assignmentStatement(
            AssignmentStatementOperatorEnum.SUB,
            [identifier('foo')],
            [numericLiteral(1)]
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle prefix increment operator', () => {
      const given = getProgramNode(`
     a = ++foo;
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('a')],
            [
              callExpression(
                functionExpression(
                  [],
                  [
                    assignmentStatement(
                      AssignmentStatementOperatorEnum.ADD,
                      [identifier('foo')],
                      [numericLiteral(1)]
                    ),
                    returnStatement(identifier('foo')),
                  ]
                ),
                []
              ),
            ]
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle suffix increment operator', () => {
      const given = getProgramNode(`
       a = foo++;
      `);
      const expected: LuaProgram = program([
        expressionStatement(
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('a')],
            [
              callExpression(
                functionExpression(
                  [],
                  [
                    variableDeclaration(
                      [variableDeclaratorIdentifier(identifier('result'))],
                      [variableDeclaratorValue(identifier('foo'))]
                    ),
                    assignmentStatement(
                      AssignmentStatementOperatorEnum.ADD,
                      [identifier('foo')],
                      [numericLiteral(1)]
                    ),
                    returnStatement(identifier('result')),
                  ]
                ),
                []
              ),
            ]
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle prefix decrement operator', () => {
      const given = getProgramNode(`
       a = --foo;
      `);
      const expected: LuaProgram = program([
        expressionStatement(
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('a')],
            [
              callExpression(
                functionExpression(
                  [],
                  [
                    assignmentStatement(
                      AssignmentStatementOperatorEnum.SUB,
                      [identifier('foo')],
                      [numericLiteral(1)]
                    ),
                    returnStatement(identifier('foo')),
                  ]
                ),
                []
              ),
            ]
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle suffix decrement operator', () => {
      const given = getProgramNode(`
         a = foo--;
        `);
      const expected: LuaProgram = program([
        expressionStatement(
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('a')],
            [
              callExpression(
                functionExpression(
                  [],
                  [
                    variableDeclaration(
                      [variableDeclaratorIdentifier(identifier('result'))],
                      [variableDeclaratorValue(identifier('foo'))]
                    ),
                    assignmentStatement(
                      AssignmentStatementOperatorEnum.SUB,
                      [identifier('foo')],
                      [numericLiteral(1)]
                    ),
                    returnStatement(identifier('result')),
                  ]
                ),
                []
              ),
            ]
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
