import { handleProgram } from './program.handler';
import {
  callExpression,
  expressionStatement,
  functionExpression,
  identifier,
  LuaProgram,
  LuaStatement,
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
    it('should handle prefix increment operator', () => {
      const given = getProgramNode(`
     ++foo;
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          callExpression(
            functionExpression(
              [],
              [
                //TODO: must be updated when handled properly
                (identifier('foo += 1') as unknown) as LuaStatement,
                returnStatement(identifier('foo')),
              ]
            ),
            []
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

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
              [
                variableDeclaration(
                  [variableDeclaratorIdentifier(identifier('result'))],
                  [variableDeclaratorValue(identifier('foo'))]
                ),
                //TODO: must be updated when handled properly
                (identifier('foo += 1') as unknown) as LuaStatement,
                returnStatement(identifier('result')),
              ]
            ),
            []
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

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
              [
                //TODO: must be updated when handled properly
                (identifier('foo -= 1') as unknown) as LuaStatement,
                returnStatement(identifier('foo')),
              ]
            ),
            []
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

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
              [
                variableDeclaration(
                  [variableDeclaratorIdentifier(identifier('result'))],
                  [variableDeclaratorValue(identifier('foo'))]
                ),
                //TODO: must be updated when handled properly
                (identifier('foo -= 1') as unknown) as LuaStatement,
                returnStatement(identifier('result')),
              ]
            ),
            []
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
