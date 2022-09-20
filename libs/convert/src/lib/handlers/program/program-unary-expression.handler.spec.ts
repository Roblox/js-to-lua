import {
  bit32Identifier,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  booleanLiteral,
  callExpression,
  expressionStatement,
  identifier,
  LuaProgram,
  memberExpression,
  nilLiteral,
  numericLiteral,
  unaryExpression,
  unaryNegationExpression,
  unaryVoidExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from './program.spec.utils';

const source = '';

describe('Unary Expression Handler', () => {
  it(`should handle typeof operator`, () => {
    const given = getProgramNode(`
            typeof foo
    `);

    const expected: LuaProgram = programWithUpstreamComment([
      expressionStatement(
        callExpression(identifier('typeof'), [identifier('foo')])
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle plus operator`, () => {
    const given = getProgramNode(`
    const bar = +foo
  `);

    const expected: LuaProgram = programWithUpstreamComment([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('bar'))],
        [
          variableDeclaratorValue(
            callExpression(identifier('tonumber'), [identifier('foo')])
          ),
        ]
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle minus operator`, () => {
    const given = getProgramNode(`
    const bar = -foo
  `);

    const expected: LuaProgram = programWithUpstreamComment([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('bar'))],
        [variableDeclaratorValue(unaryExpression('-', identifier('foo')))]
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle void operator`, () => {
    const given = getProgramNode(`
    const bar = void foo
  `);

    const expected: LuaProgram = programWithUpstreamComment([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('bar'))],
        [variableDeclaratorValue(unaryVoidExpression(identifier('foo')))]
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle void operator with string literals`, () => {
    const given = getProgramNode(`
    const foo = void "foo"
  `);

    const expected: LuaProgram = programWithUpstreamComment([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [variableDeclaratorValue(identifier('nil'))]
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle void operator with numeric literals`, () => {
    const given = getProgramNode(`
    const foo = void 0
  `);

    const expected: LuaProgram = programWithUpstreamComment([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [variableDeclaratorValue(identifier('nil'))]
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle void operator with boolean literals`, () => {
    const given = getProgramNode(`
    const foo = void false
  `);

    const expected: LuaProgram = programWithUpstreamComment([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [variableDeclaratorValue(identifier('nil'))]
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle negation operator`, () => {
    const given = getProgramNode(`const bar = !foo`);

    const expected: LuaProgram = programWithUpstreamComment([
      withTrailingConversionComment(
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('Packages'))],
          []
        ),
        'ROBLOX comment: must define Packages module'
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('LuauPolyfill'))],
        [
          variableDeclaratorValue(
            callExpression(identifier('require'), [
              memberExpression(
                identifier('Packages'),
                '.',
                identifier('LuauPolyfill')
              ),
            ])
          ),
        ]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('Boolean'))],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('LuauPolyfill'),
              '.',
              identifier('Boolean')
            )
          ),
        ]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('bar'))],
        [
          variableDeclaratorValue(
            unaryNegationExpression(
              callExpression(
                memberExpression(
                  identifier('Boolean'),
                  '.',
                  identifier('toJSBoolean')
                ),
                [identifier('foo')]
              )
            )
          ),
        ]
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle negation operator of BooleanLiteral`, () => {
    const given = getProgramNode(`const foo = !true`);

    const expected: LuaProgram = programWithUpstreamComment([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [variableDeclaratorValue(unaryNegationExpression(booleanLiteral(true)))]
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle delete operator`, () => {
    const given = getProgramNode(`
      delete foo.bar
    `);

    const expected: LuaProgram = programWithUpstreamComment([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [memberExpression(identifier('foo'), '.', identifier('bar'))],
        [nilLiteral()]
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle ~ operator`, () => {
    const given = getProgramNode(`
    ~5
  `);

    const expected: LuaProgram = programWithUpstreamComment([
      expressionStatement(
        withTrailingConversionComment(
          callExpression(
            memberExpression(bit32Identifier(), '.', identifier('bnot')),
            [numericLiteral(5, '5')]
          ),
          'ROBLOX CHECK: `bit32.bnot` clamps arguments and result to [0,2^32 - 1]'
        )
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });
});
