import {
  binaryExpression as babelBinaryExpression,
  identifier as babelIdentifier,
  numericLiteral as babelNumericLiteral,
  stringLiteral as babelStringLiteral,
} from '@babel/types';
import {
  arrayIndexOf,
  binaryExpression,
  bit32Identifier,
  callExpression,
  identifier,
  LuaBinaryExpression,
  LuaCallExpression,
  memberExpression,
  numericLiteral,
  objectKeys,
  stringLiteral,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { forwardHandlerRef } from '../../utils/forward-handler-ref';
import { handleExpression } from '../expression-statement.handler';
import { createBinaryExpressionHandler } from './binary-expression.handler';

const source = '';

describe('Binary Expression Handler', () => {
  it(`should handle subtract operator`, () => {
    const given = babelBinaryExpression(
      '-',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      identifier('foo'),
      '-',
      identifier('bar')
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle division operator`, () => {
    const given = babelBinaryExpression(
      '/',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      identifier('foo'),
      '/',
      identifier('bar')
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle multiplication operator`, () => {
    const given = babelBinaryExpression(
      '*',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      identifier('foo'),
      '*',
      identifier('bar')
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle remainder operator`, () => {
    const given = babelBinaryExpression(
      '%',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      identifier('foo'),
      '%',
      identifier('bar')
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle exponential operator`, () => {
    const given = babelBinaryExpression(
      '**',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      identifier('foo'),
      '^',
      identifier('bar')
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle add operator`, () => {
    const given = babelBinaryExpression(
      '+',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      identifier('foo'),
      '+',
      identifier('bar')
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle add operator with string literal (left)`, () => {
    const given = babelBinaryExpression(
      '+',
      babelStringLiteral('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      stringLiteral('foo'),
      '..',
      callExpression(identifier('tostring'), [identifier('bar')])
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle add operator with string literal (right)`, () => {
    const given = babelBinaryExpression(
      '+',
      babelIdentifier('foo'),
      babelStringLiteral('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      callExpression(identifier('tostring'), [identifier('foo')]),
      '..',
      stringLiteral('bar')
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle add operator with both string literals`, () => {
    const given = babelBinaryExpression(
      '+',
      babelStringLiteral('foo'),
      babelStringLiteral('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      stringLiteral('foo'),
      '..',
      stringLiteral('bar')
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle add operator with multiple string literals`, () => {
    const given = babelBinaryExpression(
      '+',
      babelBinaryExpression(
        '+',
        babelStringLiteral('foo'),
        babelStringLiteral('bar')
      ),
      babelStringLiteral('fizz')
    );
    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      binaryExpression(stringLiteral('foo'), '..', stringLiteral('bar')),
      '..',
      stringLiteral('fizz')
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle loose equality`, () => {
    const given = babelBinaryExpression(
      '==',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = withTrailingConversionComment(
      binaryExpression(identifier('foo'), '==', identifier('bar')),
      `ROBLOX CHECK: loose equality used upstream`
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle loose inequality`, () => {
    const given = babelBinaryExpression(
      '!=',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = withTrailingConversionComment(
      binaryExpression(identifier('foo'), '~=', identifier('bar')),
      `ROBLOX CHECK: loose inequality used upstream`
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle strict equality`, () => {
    const given = babelBinaryExpression(
      '===',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      identifier('foo'),
      '==',
      identifier('bar')
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle strict inequality`, () => {
    const given = babelBinaryExpression(
      '!==',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      identifier('foo'),
      '~=',
      identifier('bar')
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle in operator with variable`, () => {
    const given = babelBinaryExpression(
      'in',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      callExpression(
        memberExpression(identifier('Array'), '.', identifier('indexOf')),
        [
          callExpression(
            memberExpression(identifier('Object'), '.', identifier('keys')),
            [identifier('bar')]
          ),
          callExpression(identifier('tostring'), [identifier('foo')]),
        ]
      ),
      '~=',
      numericLiteral(-1)
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle in operator with string literal`, () => {
    const given = babelBinaryExpression(
      'in',
      babelStringLiteral('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      callExpression(arrayIndexOf(), [
        callExpression(objectKeys(), [identifier('bar')]),
        stringLiteral('foo'),
      ]),
      '~=',
      numericLiteral(-1)
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle greater than operator`, () => {
    const given = babelBinaryExpression(
      '>',
      babelStringLiteral('3'),
      babelNumericLiteral(4)
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = withTrailingConversionComment(
      binaryExpression(stringLiteral('3'), '>', numericLiteral(4)),
      `ROBLOX CHECK: operator '>' works only if either both arguments are strings or both are a number`
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle less than operator`, () => {
    const given = babelBinaryExpression(
      '<',
      babelNumericLiteral(3),
      babelNumericLiteral(4)
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = withTrailingConversionComment(
      binaryExpression(numericLiteral(3), '<', numericLiteral(4)),
      `ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number`
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle greater than or equals operator`, () => {
    const given = babelBinaryExpression(
      '>=',
      babelNumericLiteral(3),
      babelNumericLiteral(4)
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = withTrailingConversionComment(
      binaryExpression(numericLiteral(3), '>=', numericLiteral(4)),
      `ROBLOX CHECK: operator '>=' works only if either both arguments are strings or both are a number`
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle less than or equals operator`, () => {
    const given = babelBinaryExpression(
      '<=',
      babelNumericLiteral(3),
      babelNumericLiteral(4)
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = withTrailingConversionComment(
      binaryExpression(numericLiteral(3), '<=', numericLiteral(4)),
      `ROBLOX CHECK: operator '<=' works only if either both arguments are strings or both are a number`
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle bitwise and operator`, () => {
    const given = babelBinaryExpression(
      '&',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaCallExpression = withTrailingConversionComment(
      callExpression(
        memberExpression(bit32Identifier(), '.', identifier('band')),
        [identifier('foo'), identifier('bar')]
      ),
      'ROBLOX CHECK: `bit32.band` clamps arguments and result to [0,2^32 - 1]'
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle bitwise or operator`, () => {
    const given = babelBinaryExpression(
      '|',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaCallExpression = withTrailingConversionComment(
      callExpression(
        memberExpression(bit32Identifier(), '.', identifier('bor')),
        [identifier('foo'), identifier('bar')]
      ),
      'ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1]'
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle bitwise xor operator`, () => {
    const given = babelBinaryExpression(
      '^',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaCallExpression = withTrailingConversionComment(
      callExpression(
        memberExpression(bit32Identifier(), '.', identifier('bxor')),
        [identifier('foo'), identifier('bar')]
      ),
      'ROBLOX CHECK: `bit32.bxor` clamps arguments and result to [0,2^32 - 1]'
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle bitwise unsigned shift right operator`, () => {
    const given = babelBinaryExpression(
      '>>>',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaCallExpression = withTrailingConversionComment(
      callExpression(
        memberExpression(bit32Identifier(), '.', identifier('rshift')),
        [identifier('foo'), identifier('bar')]
      ),
      'ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1]'
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle bitwise shift right operator`, () => {
    const given = babelBinaryExpression(
      '>>',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaCallExpression = withTrailingConversionComment(
      callExpression(
        memberExpression(bit32Identifier(), '.', identifier('arshift')),
        [identifier('foo'), identifier('bar')]
      ),
      'ROBLOX CHECK: `bit32.arshift` clamps arguments and result to [0,2^32 - 1]'
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle bitwise shift left operator`, () => {
    const given = babelBinaryExpression(
      '<<',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaCallExpression = withTrailingConversionComment(
      callExpression(
        memberExpression(bit32Identifier(), '.', identifier('lshift')),
        [identifier('foo'), identifier('bar')]
      ),
      'ROBLOX CHECK: `bit32.lshift` clamps arguments and result to [0,2^32 - 1]'
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });
});
