import {
  assignmentStatement,
  binaryExpression,
  functionDeclaration,
  identifier,
  ifStatement,
  LuaProgram,
  nilLiteral,
  program,
  stringLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';
import { handleProgram } from './program.handler';

const source = '';

describe('Program handler', () => {
  describe('Function Declarations', () => {
    it('should handle function with no params', () => {
      const given = getProgramNode(`
     function foo() {}
    `);
      const expected: LuaProgram = program([
        functionDeclaration(identifier('foo'), [], []),
      ]);

      const luaProgram = handleProgram.handler(source, given);
      expect(luaProgram).toEqual(expected);
    });
  });

  it('should handle function with params', () => {
    const given = getProgramNode(`
   function foo(bar, baz) {}
  `);
    const expected: LuaProgram = program([
      functionDeclaration(
        identifier('foo'),
        [identifier('bar'), identifier('baz')],
        []
      ),
    ]);

    const luaProgram = handleProgram.handler(source, given);
    expect(luaProgram).toEqual(expected);
  });

  it('should handle function with params and default values', () => {
    const given = getProgramNode(`
   function foo(bar, baz = 'hello') {}
  `);
    const expected: LuaProgram = program([
      functionDeclaration(
        identifier('foo'),
        [identifier('bar'), identifier('baz')],
        [
          ifStatement(binaryExpression(identifier('baz'), '==', nilLiteral()), [
            assignmentStatement([identifier('baz')], [stringLiteral('hello')]),
          ]),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, given);
    expect(luaProgram).toEqual(expected);
  });

  it('should handle function with function body', () => {
    const given = getProgramNode(`
   function foo(bar, baz = 'hello') {
       let fizz = 'fuzz';
   }
  `);

    const expected: LuaProgram = program([
      functionDeclaration(
        identifier('foo'),
        [identifier('bar'), identifier('baz')],
        [
          ifStatement(binaryExpression(identifier('baz'), '==', nilLiteral()), [
            assignmentStatement([identifier('baz')], [stringLiteral('hello')]),
          ]),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('fizz'))],
            [variableDeclaratorValue(stringLiteral('fuzz'))]
          ),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, given);
    expect(luaProgram).toEqual(expected);
  });
});
