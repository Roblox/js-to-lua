import {
  booleanLiteral,
  booleanMethod,
  callExpression,
  expressionStatement,
  identifier,
  LuaProgram,
  memberExpression,
  program,
  unaryDeleteExpression,
  unaryExpression,
  unaryNegationExpression,
  unaryVoidExpression,
} from '@js-to-lua/lua-types';
import { handleProgram } from './program.handler';
import { getProgramNode } from './program.spec.utils';

const source = '';

describe('Unary Expression Handler', () => {
  it(`should handle typeof operator`, () => {
    const given = getProgramNode(`
            typeof foo
    `);

    const expected: LuaProgram = program([
      expressionStatement(
        callExpression(identifier('typeof'), [identifier('foo')])
      ),
    ]);

    expect(handleProgram.handler(source, given)).toEqual(expected);
  });

  it(`should handle plus operator`, () => {
    const given = getProgramNode(`
    +foo
  `);

    const expected: LuaProgram = program([
      expressionStatement(
        callExpression(identifier('tonumber'), [identifier('foo')])
      ),
    ]);

    expect(handleProgram.handler(source, given)).toEqual(expected);
  });

  it(`should handle minus operator`, () => {
    const given = getProgramNode(`
    -foo
  `);

    const expected: LuaProgram = program([
      expressionStatement(unaryExpression('-', identifier('foo'))),
    ]);

    expect(handleProgram.handler(source, given)).toEqual(expected);
  });

  it(`should handle void operator`, () => {
    const given = getProgramNode(`
    void foo
  `);

    const expected: LuaProgram = program([
      expressionStatement(unaryVoidExpression(identifier('foo'))),
    ]);

    expect(handleProgram.handler(source, given)).toEqual(expected);
  });

  it(`should handle negation operator`, () => {
    const given = getProgramNode(`!foo`);

    const expected: LuaProgram = program([
      expressionStatement(
        unaryNegationExpression(
          callExpression(booleanMethod('toJSBoolean'), [identifier('foo')])
        )
      ),
    ]);

    expect(handleProgram.handler(source, given)).toEqual(expected);
  });

  it(`should handle negation operator of BooleanLiteral`, () => {
    const given = getProgramNode(`!true`);

    const expected: LuaProgram = program([
      expressionStatement(unaryNegationExpression(booleanLiteral(true))),
    ]);

    expect(handleProgram.handler(source, given)).toEqual(expected);
  });

  it(`should handle delete operator`, () => {
    const given = getProgramNode(`
    delete foo.bar
  `);

    const expected: LuaProgram = program([
      expressionStatement(
        unaryDeleteExpression(
          memberExpression(identifier('foo'), '.', identifier('bar'))
        )
      ),
    ]);

    expect(handleProgram.handler(source, given)).toEqual(expected);
  });
});
