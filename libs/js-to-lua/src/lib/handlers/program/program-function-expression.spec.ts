import { handleProgram } from './program.handler';
import {
  functionDeclaration,
  identifier,
  LuaProgram,
  nodeGroup,
  program,
  stringLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';

describe('Program handler', () => {
  describe('Function Expressions', () => {
    it('should ignore function name', () => {
      const given = getProgramNode(`
       const foo = function foo() {}
      `);

      const expected: LuaProgram = program([
        nodeGroup([functionDeclaration(identifier('foo'), [], [], [])]),
      ]);
      const luaProgram = handleProgram.handler(given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with no params', () => {
      const given = getProgramNode(`
     const foo = function () {}
    `);

      const expected: LuaProgram = program([
        nodeGroup([functionDeclaration(identifier('foo'), [], [], [])]),
      ]);
      const luaProgram = handleProgram.handler(given);
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
            [],
            []
          ),
        ]),
      ]);

      const luaProgram = handleProgram.handler(given);
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
            [],
            []
          ),
        ]),
      ]);

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram.body[0].type).toEqual('NodeGroup');
      if (luaProgram.body[0].type === 'NodeGroup') {
        expect(luaProgram.body[0].body[0]['defaultValues'].length).toBe(1); //TODO: remove when AssignmentPattern is available
        luaProgram.body[0].body[0]['defaultValues'] = []; //TODO: remove when AssigmentBlock is available
      }
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
            [],
            [
              variableDeclaration(
                [variableDeclaratorIdentifier(identifier('fizz'))],
                [variableDeclaratorValue(stringLiteral('fuzz'))]
              ),
            ]
          ),
        ]),
      ]);

      const luaProgram = handleProgram.handler(given);
      expect(luaProgram.body[0].type).toEqual('NodeGroup');

      if (luaProgram.body[0].type === 'NodeGroup') {
        expect(luaProgram.body[0].body[0]['defaultValues'].length).toBe(1); //TODO: remove when AssignmentPattern is available
        luaProgram.body[0].body[0]['defaultValues'] = []; //TODO: remove when AssigmentBlock is available
      }
      expect(luaProgram).toEqual(expected);
    });
  });
});
