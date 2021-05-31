import { handleProgram } from './program.handler';
import {
  callExpression,
  expressionStatement,
  functionExpression,
  identifier,
  LuaProgram,
  program,
  returnStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';

describe('Program handler', () => {
  describe('Update expression', () => {
    it('should handle prefix increment operator', () => {
      const given = getProgramNode(`
     ++foo;
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          callExpression(
            functionExpression(
              [],
              [],
              [
                //TODO: must be updated when handled properly
                identifier('foo += 1'),
                returnStatement(identifier('foo')),
              ]
            ),
            []
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle suffix increment operator', () => {
      const given = getProgramNode(`
       foo++;
      `);
      const expected: LuaProgram = program([
        expressionStatement(
          callExpression(
            functionExpression(
              [],
              [],
              [
                variableDeclaration(
                  [variableDeclaratorIdentifier(identifier('result'))],
                  [variableDeclaratorValue(identifier('foo'))]
                ),
                //TODO: must be updated when handled properly
                identifier('foo += 1'),
                returnStatement(identifier('result')),
              ]
            ),
            []
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle prefix decrement operator', () => {
      const given = getProgramNode(`
       --foo;
      `);
      const expected: LuaProgram = program([
        expressionStatement(
          callExpression(
            functionExpression(
              [],
              [],
              [
                //TODO: must be updated when handled properly
                identifier('foo -= 1'),
                returnStatement(identifier('foo')),
              ]
            ),
            []
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle suffix decrement operator', () => {
      const given = getProgramNode(`
         foo--;
        `);
      const expected: LuaProgram = program([
        expressionStatement(
          callExpression(
            functionExpression(
              [],
              [],
              [
                variableDeclaration(
                  [variableDeclaratorIdentifier(identifier('result'))],
                  [variableDeclaratorValue(identifier('foo'))]
                ),
                //TODO: must be updated when handled properly
                identifier('foo -= 1'),
                returnStatement(identifier('result')),
              ]
            ),
            []
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
