import { Program } from '@babel/types';
import {
  callExpression,
  expressionStatement,
  identifier,
  indexExpression,
  LuaProgram,
  memberExpression,
  program,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { handleProgram } from './program.handler';
import { getProgramNode } from './program.spec.utils';

describe('Call Expression Handler', () => {
  it(`should handle computed member expressions`, () => {
    const given: Program = getProgramNode(`
    foo['bar']()
    foo['bar']('baz')
    foo.bar['baz']()
    `);

    const expected: LuaProgram = program([
      expressionStatement(
        callExpression(
          indexExpression(identifier('foo'), stringLiteral('bar')),
          [identifier('foo')]
        )
      ),
      expressionStatement(
        callExpression(
          indexExpression(identifier('foo'), stringLiteral('bar')),
          [identifier('foo'), stringLiteral('baz')]
        )
      ),
      expressionStatement(
        callExpression(
          indexExpression(
            memberExpression(identifier('foo'), '.', identifier('bar')),
            stringLiteral('baz')
          ),
          [memberExpression(identifier('foo'), '.', identifier('bar'))]
        )
      ),
    ]);

    expect(handleProgram.handler(given)).toEqual(expected);
  });

  it(`should handle not computed member expressions`, () => {
    const given: Program = getProgramNode(`
      foo.bar()
      foo.bar('baz')
      foo.bar.baz()
      `);

    const expected: LuaProgram = program([
      expressionStatement(
        callExpression(
          memberExpression(identifier('foo'), ':', identifier('bar')),
          []
        )
      ),
      expressionStatement(
        callExpression(
          memberExpression(identifier('foo'), ':', identifier('bar')),
          [stringLiteral('baz')]
        )
      ),
      expressionStatement(
        callExpression(
          memberExpression(
            memberExpression(identifier('foo'), '.', identifier('bar')),
            ':',
            identifier('baz')
          ),
          []
        )
      ),
    ]);

    expect(handleProgram.handler(given)).toEqual(expected);
  });

  describe('Special cases', () => {
    it(`should handle toString() method`, () => {
      const given: Program = getProgramNode(`
      foo.toString()
      foo['toString']()
      foo.toString('baz')
      foo['toString']('baz')
      `);

      const expected: LuaProgram = program([
        expressionStatement(
          callExpression(identifier('tostring'), [identifier('foo')])
        ),
        expressionStatement(
          callExpression(identifier('tostring'), [identifier('foo')])
        ),

        expressionStatement(
          callExpression(
            memberExpression(identifier('foo'), ':', identifier('toString')),
            [stringLiteral('baz')]
          )
        ),
        expressionStatement(
          callExpression(
            indexExpression(identifier('foo'), stringLiteral('toString')),
            [identifier('foo'), stringLiteral('baz')]
          )
        ),
      ]);

      expect(handleProgram.handler(given)).toEqual(expected);
    });

    it(`should handle React object`, () => {
      const given: Program = getProgramNode(`
      React.createElement("div")
      React['createElement']("div")
      React.foo()
      React['foo']()
      `);

      const expected: LuaProgram = program([
        expressionStatement(
          callExpression(
            memberExpression(
              identifier('React'),
              '.',
              identifier('createElement')
            ),
            [stringLiteral('div')]
          )
        ),
        expressionStatement(
          callExpression(
            indexExpression(
              identifier('React'),
              stringLiteral('createElement')
            ),
            [stringLiteral('div')]
          )
        ),
        expressionStatement(
          callExpression(
            memberExpression(identifier('React'), '.', identifier('foo')),
            []
          )
        ),
        expressionStatement(
          callExpression(
            indexExpression(identifier('React'), stringLiteral('foo')),
            []
          )
        ),
      ]);

      expect(handleProgram.handler(given)).toEqual(expected);
    });
  });
});
