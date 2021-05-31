import { handleProgram } from './program.handler';
import {
  identifier,
  LuaProgram,
  program,
  variableDeclaration,
  variableDeclaratorValue,
  variableDeclaratorIdentifier,
  functionExpression,
  returnStatement,
  numericLiteral,
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';
import { stringLiteral } from '@babel/types';

describe('Program handler', () => {
  describe('Arrow Function', () => {
    it('should handle arrow function with no params', () => {
      const given = getProgramNode(`
       const foo = () => {}
      `);
      const expected: LuaProgram = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [variableDeclaratorValue(functionExpression([], [], []))]
        ),
      ]);

      const luaProgram = handleProgram.handler(given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle arrow function with params', () => {
      const given = getProgramNode(`
   const foo = (bar, baz) => {}
  `);

      const expected: LuaProgram = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              functionExpression([identifier('bar'), identifier('baz')], [], [])
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle arrow function with params and default values', () => {
      const given = getProgramNode(`
   const foo = (bar, baz = 'hello') => {}
  `);

      const expected: LuaProgram = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              functionExpression([identifier('bar'), identifier('baz')], [], [])
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram.body[0]['values'][0].value.defaultValues.length).toBe(
        1
      ); //TODO: remove when AssignmentPattern is available
      luaProgram.body[0]['values'][0].value.defaultValues = []; //TODO: remove when AssigmentBlock is available
      expect(luaProgram).toEqual(expected);
    });

    it('should handle arrow function with body', () => {
      const given = getProgramNode(`
   const foo = (bar, baz = 'hello') => {
       let fizz = 'fuzz';
   }
  `);

      const expected: LuaProgram = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              functionExpression(
                [identifier('bar'), identifier('baz')],
                [],
                [
                  variableDeclaration(
                    [variableDeclaratorIdentifier(identifier('fizz'))],
                    [variableDeclaratorValue(stringLiteral('fuzz'))]
                  ),
                ]
              )
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(given);
      expect(luaProgram.body[0]['values'][0].value.defaultValues.length).toBe(
        1
      ); //TODO: remove when AssignmentPattern is available
      luaProgram.body[0]['values'][0].value.defaultValues = []; //TODO: remove when AssigmentBlock is available
      expect(luaProgram).toEqual(expected);
    });

    it('should handle arrow function with expression as body', () => {
      const given = getProgramNode(`
       const foo = () => "wole"
      `);

      const expected: LuaProgram = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              functionExpression(
                [],
                [],
                [returnStatement(stringLiteral('wole'))]
              )
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle arrow function with another arrow function', () => {
      const given = getProgramNode(`
      const foo = () => () => 31337
      `);

      const expected: LuaProgram = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              functionExpression(
                [],
                [],
                [
                  returnStatement(
                    functionExpression(
                      [],
                      [],
                      [returnStatement(numericLiteral(31337, '31337'))]
                    )
                  ),
                ]
              )
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(given);
      expect(luaProgram).toEqual(expected);
    });
  });
});
