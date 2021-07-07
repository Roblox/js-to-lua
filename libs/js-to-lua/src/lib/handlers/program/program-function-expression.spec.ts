import { handleProgram } from './program.handler';
import {
  assignmentStatement,
  binaryExpression,
  functionDeclaration,
  identifier,
  ifClause,
  ifStatement,
  LuaProgram,
  nilLiteral,
  nodeGroup,
  program,
  stringLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Function Expressions', () => {
    it('should ignore function name', () => {
      const given = getProgramNode(`
       const foo = function foo() {}
      `);

      const expected: LuaProgram = program([
        nodeGroup([functionDeclaration(identifier('foo'), [], [])]),
      ]);
      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with no params', () => {
      const given = getProgramNode(`
     const foo = function () {}
    `);

      const expected: LuaProgram = program([
        nodeGroup([functionDeclaration(identifier('foo'), [], [])]),
      ]);
      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with params', () => {
      const given = getProgramNode(`
   const foo = function (bar, baz) {}
  `);

      const expected: LuaProgram = program([
        nodeGroup([
          functionDeclaration(
            identifier('foo'),
            [identifier('bar'), identifier('baz')],
            []
          ),
        ]),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with params and default values', () => {
      const given = getProgramNode(`
   const foo = function (bar, baz = 'hello') {}
  `);

      const expected: LuaProgram = program([
        nodeGroup([
          functionDeclaration(
            identifier('foo'),
            [identifier('bar'), identifier('baz')],
            [
              ifStatement(
                ifClause(
                  binaryExpression(identifier('baz'), '==', nilLiteral()),
                  [
                    assignmentStatement(
                      [identifier('baz')],
                      [stringLiteral('hello')]
                    ),
                  ]
                )
              ),
            ]
          ),
        ]),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with function body', () => {
      const given = getProgramNode(`
   const foo = function (bar, baz = 'hello') {
       let fizz = 'fuzz';
   }
  `);

      const expected: LuaProgram = program([
        nodeGroup([
          functionDeclaration(
            identifier('foo'),
            [identifier('bar'), identifier('baz')],
            [
              ifStatement(
                ifClause(
                  binaryExpression(identifier('baz'), '==', nilLiteral()),
                  [
                    assignmentStatement(
                      [identifier('baz')],
                      [stringLiteral('hello')]
                    ),
                  ]
                )
              ),
              variableDeclaration(
                [variableDeclaratorIdentifier(identifier('fizz'))],
                [variableDeclaratorValue(stringLiteral('fuzz'))]
              ),
            ]
          ),
        ]),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });
  });
});
