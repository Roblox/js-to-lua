import { handleProgram } from './program.handler';
import {
  LuaProgram,
  binaryExpression,
  stringLiteral,
  expressionStatement,
  program,
  identifier,
  callExpression,
  numericLiteral,
  booleanLiteral,
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';

describe('Program handler', () => {
  describe('Binary expression', () => {
    it('should handle arithmetic exponential operator', () => {
      const given = getProgramNode(`
     foo ** bar;
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          binaryExpression(identifier('foo'), '^', identifier('bar'))
        ),
      ]);

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic subtract operator', () => {
      const given = getProgramNode(`
     foo - bar;
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          binaryExpression(identifier('foo'), '-', identifier('bar'))
        ),
      ]);

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic multiplication operator', () => {
      const given = getProgramNode(`
     foo * bar;
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          binaryExpression(identifier('foo'), '*', identifier('bar'))
        ),
      ]);

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic division operator', () => {
      const given = getProgramNode(`
     foo / bar;
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          binaryExpression(identifier('foo'), '/', identifier('bar'))
        ),
      ]);

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic remainder operator', () => {
      const given = getProgramNode(`
     foo % bar;
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          binaryExpression(identifier('foo'), '%', identifier('bar'))
        ),
      ]);

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic add operator', () => {
      const given = getProgramNode(`
     foo + bar;
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          binaryExpression(identifier('foo'), '+', identifier('bar'))
        ),
      ]);

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic add operator with string literals', () => {
      const given = getProgramNode(`
     'foo' + 'bar';
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          binaryExpression(stringLiteral('foo'), '..', stringLiteral('bar'))
        ),
      ]);

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic add operator with one string literal', () => {
      const given = getProgramNode(`
      "foo" + bar
      foo + "bar"
      "foo" + 5
      "foo"+ true
     
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          binaryExpression(
            stringLiteral('foo'),
            '..',
            callExpression(identifier('tostring'), [identifier('bar')])
          )
        ),
        expressionStatement(
          binaryExpression(
            callExpression(identifier('tostring'), [identifier('foo')]),
            '..',
            stringLiteral('bar')
          )
        ),
        expressionStatement(
          binaryExpression(
            stringLiteral('foo'),
            '..',
            callExpression(identifier('tostring'), [numericLiteral(5, '5')])
          )
        ),
        expressionStatement(
          binaryExpression(
            stringLiteral('foo'),
            '..',
            callExpression(identifier('tostring'), [booleanLiteral(true)])
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
