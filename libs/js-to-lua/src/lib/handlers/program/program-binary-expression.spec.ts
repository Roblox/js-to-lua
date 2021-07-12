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
  arrayIndexOf,
  objectKeys,
  withTrailingConversionComment,
  memberExpression,
  bit32Identifier,
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';

const source = '';

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

      const luaProgram = handleProgram.handler(source, {}, given);

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

      const luaProgram = handleProgram.handler(source, {}, given);

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

      const luaProgram = handleProgram.handler(source, {}, given);

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

      const luaProgram = handleProgram.handler(source, {}, given);

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

      const luaProgram = handleProgram.handler(source, {}, given);

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

      const luaProgram = handleProgram.handler(source, {}, given);

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

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle arithmetic add operator with multiple string literals', () => {
      const given = getProgramNode(`
     'foo' + 'bar' + 'fizz' + 'buzz';
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          binaryExpression(
            binaryExpression(
              binaryExpression(
                stringLiteral('foo'),
                '..',
                stringLiteral('bar')
              ),
              '..',
              stringLiteral('fizz')
            ),
            '..',
            stringLiteral('buzz')
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

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

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle equality operator', () => {
      const given = getProgramNode(`
     foo == bar;
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          withTrailingConversionComment(
            binaryExpression(identifier('foo'), '==', identifier('bar')),
            `ROBLOX CHECK: loose equality used upstream`
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle inequality operator', () => {
      const given = getProgramNode(`
     foo != bar;
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          withTrailingConversionComment(
            binaryExpression(identifier('foo'), '~=', identifier('bar')),
            `ROBLOX CHECK: loose inequality used upstream`
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle strict equality operator', () => {
      const given = getProgramNode(`
     foo === bar;
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          binaryExpression(identifier('foo'), '==', identifier('bar'))
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle strict inequality operator', () => {
      const given = getProgramNode(`
     foo !== bar;
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          binaryExpression(identifier('foo'), '~=', identifier('bar'))
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle in operator (string literal in left side)', () => {
      const given = getProgramNode(`
     'foo' in bar
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          binaryExpression(
            callExpression(arrayIndexOf(), [
              callExpression(objectKeys(), [identifier('bar')]),
              stringLiteral('foo'),
            ]),
            '~=',
            numericLiteral(-1)
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle in operator (non string literal in left side)', () => {
      const given = getProgramNode(`
     foo in bar
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          binaryExpression(
            callExpression(arrayIndexOf(), [
              callExpression(objectKeys(), [identifier('bar')]),
              callExpression(identifier('tostring'), [identifier('foo')]),
            ]),
            '~=',
            numericLiteral(-1)
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle less than operator', () => {
      const given = getProgramNode(`
     3 < 4;
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          withTrailingConversionComment(
            binaryExpression(
              numericLiteral(3, '3'),
              '<',
              numericLiteral(4, '4')
            ),
            `ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number`
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle greater than operator', () => {
      const given = getProgramNode(`
     3 > 4;
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          withTrailingConversionComment(
            binaryExpression(
              numericLiteral(3, '3'),
              '>',
              numericLiteral(4, '4')
            ),
            `ROBLOX CHECK: operator '>' works only if either both arguments are strings or both are a number`
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle less than or equals operator', () => {
      const given = getProgramNode(`
     3 <= 4;
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          withTrailingConversionComment(
            binaryExpression(
              numericLiteral(3, '3'),
              '<=',
              numericLiteral(4, '4')
            ),
            `ROBLOX CHECK: operator '<=' works only if either both arguments are strings or both are a number`
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle greater than or equals operator', () => {
      const given = getProgramNode(`
     3 >= 4;
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          withTrailingConversionComment(
            binaryExpression(
              numericLiteral(3, '3'),
              '>=',
              numericLiteral(4, '4')
            ),
            `ROBLOX CHECK: operator '>=' works only if either both arguments are strings or both are a number`
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle bitwise and operator', () => {
      const given = getProgramNode(`
     foo & bar
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          withTrailingConversionComment(
            callExpression(
              memberExpression(bit32Identifier(), '.', identifier('band')),
              [identifier('foo'), identifier('bar')]
            ),
            'ROBLOX CHECK: `bit32.band` clamps arguments and result to [0,2^32 - 1]'
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle bitwise or operator', () => {
      const given = getProgramNode(`
     foo | bar
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          withTrailingConversionComment(
            callExpression(
              memberExpression(bit32Identifier(), '.', identifier('bor')),
              [identifier('foo'), identifier('bar')]
            ),
            'ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1]'
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle bitwise xor operator', () => {
      const given = getProgramNode(`
     foo ^ bar
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          withTrailingConversionComment(
            callExpression(
              memberExpression(bit32Identifier(), '.', identifier('bxor')),
              [identifier('foo'), identifier('bar')]
            ),
            'ROBLOX CHECK: `bit32.bxor` clamps arguments and result to [0,2^32 - 1]'
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle bitwise unsigned shift right operator', () => {
      const given = getProgramNode(`
     foo >>> bar
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          withTrailingConversionComment(
            callExpression(
              memberExpression(bit32Identifier(), '.', identifier('rshift')),
              [identifier('foo'), identifier('bar')]
            ),
            'ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1]'
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle bitwise shift right operator', () => {
      const given = getProgramNode(`
     foo >> bar
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          withTrailingConversionComment(
            callExpression(
              memberExpression(bit32Identifier(), '.', identifier('arshift')),
              [identifier('foo'), identifier('bar')]
            ),
            'ROBLOX CHECK: `bit32.arshift` clamps arguments and result to [0,2^32 - 1]'
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle bitwise shift left operator', () => {
      const given = getProgramNode(`
     foo << bar
    `);
      const expected: LuaProgram = program([
        expressionStatement(
          withTrailingConversionComment(
            callExpression(
              memberExpression(bit32Identifier(), '.', identifier('lshift')),
              [identifier('foo'), identifier('bar')]
            ),
            'ROBLOX CHECK: `bit32.lshift` clamps arguments and result to [0,2^32 - 1]'
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
