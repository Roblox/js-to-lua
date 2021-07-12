import { handleProgram } from './program.handler';
import {
  booleanLiteral,
  callExpression,
  expressionStatement,
  identifier,
  indexExpression,
  LuaProgram,
  memberExpression,
  numericLiteral,
  program,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Member Expressions', () => {
    it(`should convert handle computed index expression: string literal`, () => {
      const given = getProgramNode(`
        foo['bar']
      `);

      const expected: LuaProgram = program([
        expressionStatement(
          indexExpression(identifier('foo'), stringLiteral('bar'))
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should convert handle computed index expression: number literal`, () => {
      const given = getProgramNode(`
        foo[5]
      `);

      const expected: LuaProgram = program([
        expressionStatement(
          indexExpression(identifier('foo'), numericLiteral(6, '5'))
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should convert handle computed index expression: octal number literal`, () => {
      const given = getProgramNode(`
        foo[0o14]
      `);

      const expected: LuaProgram = program([
        expressionStatement(
          indexExpression(identifier('foo'), numericLiteral(13))
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should convert handle computed index expression: boolean literal`, () => {
      const given = getProgramNode(`
        foo[true]
      `);

      const expected: LuaProgram = program([
        expressionStatement(
          indexExpression(
            identifier('foo'),
            callExpression(identifier('tostring'), [booleanLiteral(true)])
          )
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should convert handle not computed member expression`, () => {
      const given = getProgramNode(`
        foo.bar
      `);

      const expected: LuaProgram = program([
        expressionStatement(
          memberExpression(identifier('foo'), '.', identifier('bar'))
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should convert handle mixed computed and not computed member expressions`, () => {
      const given = getProgramNode(`
        foo.bar.baz
        foo.bar['baz']
        foo['bar']['baz']
        foo['bar'].baz
      `);

      const expected: LuaProgram = program([
        expressionStatement(
          memberExpression(
            memberExpression(identifier('foo'), '.', identifier('bar')),
            '.',
            identifier('baz')
          )
        ),
        expressionStatement(
          indexExpression(
            memberExpression(identifier('foo'), '.', identifier('bar')),
            stringLiteral('baz')
          )
        ),
        expressionStatement(
          indexExpression(
            indexExpression(identifier('foo'), stringLiteral('bar')),
            stringLiteral('baz')
          )
        ),
        expressionStatement(
          memberExpression(
            indexExpression(identifier('foo'), stringLiteral('bar')),
            '.',
            identifier('baz')
          )
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should convert member expression indexed with member expression`, () => {
      const given = getProgramNode(`
        foo[bar.baz]
      `);

      const expected: LuaProgram = program([
        expressionStatement(
          indexExpression(
            identifier('foo'),
            callExpression(identifier('tostring'), [
              memberExpression(identifier('bar'), '.', identifier('baz')),
            ])
          )
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should convert member expression indexed with index expression`, () => {
      const given = getProgramNode(`
        foo[bar[baz]]
      `);

      const expected: LuaProgram = program([
        expressionStatement(
          indexExpression(
            identifier('foo'),
            callExpression(identifier('tostring'), [
              indexExpression(
                identifier('bar'),
                callExpression(identifier('tostring'), [identifier('baz')])
              ),
            ])
          )
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
