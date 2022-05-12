import {
  BinaryExpression as BabelBinaryExpression,
  binaryExpression as babelBinaryExpression,
  identifier as babelIdentifier,
  numericLiteral as babelNumericLiteral,
  stringLiteral as babelStringLiteral,
  templateElement as babelTemplateElement,
  templateLiteral as babelTemplateLiteral,
} from '@babel/types';
import { forwardHandlerRef } from '@js-to-lua/handler-utils';
import {
  arrayIdentifier,
  arrayIndexOf,
  bit32Identifier,
  objectIdentifier,
  objectKeys,
  stringInferableExpression,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  callExpression,
  identifier,
  LuaBinaryExpression,
  LuaCallExpression,
  memberExpression,
  multilineStringLiteral,
  numericLiteral,
  stringLiteral,
  unhandledExpression,
} from '@js-to-lua/lua-types';
import { expressionHandler } from '../../expression-statement.handler';
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      binaryExpression(stringLiteral('foo'), '..', stringLiteral('bar')),
      '..',
      stringLiteral('fizz')
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle add operator with one string literal and two identifiers`, () => {
    const given = babelBinaryExpression(
      '+',
      babelBinaryExpression(
        '+',
        babelStringLiteral('foo'),
        babelIdentifier('bar')
      ),
      babelIdentifier('fizz')
    );
    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => expressionHandler)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      binaryExpression(
        stringLiteral('foo'),
        '..',
        callExpression(identifier('tostring'), [identifier('bar')])
      ),
      '..',
      callExpression(identifier('tostring'), [identifier('fizz')])
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle add operator with multiple template literals`, () => {
    const given = babelBinaryExpression(
      '+',
      babelBinaryExpression(
        '+',
        babelTemplateLiteral([babelTemplateElement({ raw: 'a string' })], []),
        babelTemplateLiteral(
          [babelTemplateElement({ raw: 'a multiline\nstring' })],
          []
        )
      ),
      babelTemplateLiteral(
        [
          babelTemplateElement({ raw: 'with expression ' }),
          babelTemplateElement({ raw: '' }, true),
        ],
        [babelIdentifier('foo')]
      )
    );
    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => expressionHandler)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      binaryExpression(
        stringLiteral('a string'),
        '..',
        multilineStringLiteral('a multiline\nstring')
      ),
      '..',
      stringInferableExpression(
        callExpression(
          memberExpression(
            stringLiteral('with expression %s'),
            ':',
            identifier('format')
          ),
          [identifier('foo')]
        )
      )
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle add operator with one template literal and two identifiers`, () => {
    const given = babelBinaryExpression(
      '+',
      babelBinaryExpression(
        '+',
        babelTemplateLiteral([babelTemplateElement({ raw: 'a string' })], []),
        babelIdentifier('bar')
      ),
      babelIdentifier('fizz')
    );
    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => expressionHandler)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      binaryExpression(
        stringLiteral('a string'),
        '..',
        callExpression(identifier('tostring'), [identifier('bar')])
      ),
      '..',
      callExpression(identifier('tostring'), [identifier('fizz')])
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      callExpression(
        memberExpression(arrayIdentifier(), '.', identifier('indexOf')),
        [
          callExpression(
            memberExpression(objectIdentifier(), '.', identifier('keys')),
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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
      forwardHandlerRef(() => expressionHandler)
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

  it(`should fail gracefully for unrecognised operator`, () => {
    const given: BabelBinaryExpression = {
      ...babelBinaryExpression(
        '==',
        babelIdentifier('foo'),
        babelIdentifier('bar')
      ),
      // bamboozle TS into allowing this
      operator: 'boom' as unknown as BabelBinaryExpression['operator'],
    };

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => expressionHandler)
    );

    const expected = withTrailingConversionComment(
      unhandledExpression(),
      "ROBLOX TODO: Unhandled node for type: BinaryExpression with 'boom' operator"
    );

    expect(handleBinaryExpression.handler(source, {}, given)).toEqual(expected);
  });
});
