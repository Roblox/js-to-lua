import { BinaryExpression } from '@babel/types';
import {
  callExpression,
  identifier,
  LuaBinaryExpression,
  binaryExpression,
  stringLiteral,
  memberExpression,
  numericLiteral,
  arrayIndexOf,
  objectKeys,
} from '@js-to-lua/lua-types';
import { forwardHandlerRef } from '../utils/forward-handler-ref';
import { handleExpression } from './expression-statement.handler';
import { createBinaryExpressionHandler } from './binary-expression.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

const source = '';

describe('Binary Expression Handler', () => {
  it(`should handle subtract operator`, () => {
    const given: BinaryExpression = {
      ...DEFAULT_NODE,
      type: 'BinaryExpression',
      operator: '-',
      left: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
      },
      right: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'bar',
      },
    };

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      identifier('foo'),
      '-',
      identifier('bar')
    );

    expect(handleBinaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle division operator`, () => {
    const given: BinaryExpression = {
      ...DEFAULT_NODE,
      type: 'BinaryExpression',
      operator: '/',
      left: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
      },
      right: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'bar',
      },
    };

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      identifier('foo'),
      '/',
      identifier('bar')
    );

    expect(handleBinaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle multiplication operator`, () => {
    const given: BinaryExpression = {
      ...DEFAULT_NODE,
      type: 'BinaryExpression',
      operator: '*',
      left: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
      },
      right: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'bar',
      },
    };

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      identifier('foo'),
      '*',
      identifier('bar')
    );

    expect(handleBinaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle remainder operator`, () => {
    const given: BinaryExpression = {
      ...DEFAULT_NODE,
      type: 'BinaryExpression',
      operator: '%',
      left: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
      },
      right: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'bar',
      },
    };

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      identifier('foo'),
      '%',
      identifier('bar')
    );

    expect(handleBinaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle exponential operator`, () => {
    const given: BinaryExpression = {
      ...DEFAULT_NODE,
      type: 'BinaryExpression',
      operator: '**',
      left: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
      },
      right: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'bar',
      },
    };

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      identifier('foo'),
      '^',
      identifier('bar')
    );

    expect(handleBinaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle add operator`, () => {
    const given: BinaryExpression = {
      ...DEFAULT_NODE,
      type: 'BinaryExpression',
      operator: '+',
      left: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
      },
      right: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'bar',
      },
    };

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      identifier('foo'),
      '+',
      identifier('bar')
    );

    expect(handleBinaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle add operator with string literal (left)`, () => {
    const given: BinaryExpression = {
      ...DEFAULT_NODE,
      type: 'BinaryExpression',
      operator: '+',
      left: {
        ...DEFAULT_NODE,
        type: 'StringLiteral',
        value: 'foo',
      },
      right: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'bar',
      },
    };

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      stringLiteral('foo'),
      '..',
      callExpression(identifier('tostring'), [identifier('bar')])
    );

    expect(handleBinaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle add operator with string literal (right)`, () => {
    const given: BinaryExpression = {
      ...DEFAULT_NODE,
      type: 'BinaryExpression',
      operator: '+',
      left: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
      },
      right: {
        ...DEFAULT_NODE,
        type: 'StringLiteral',
        value: 'bar',
      },
    };

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      callExpression(identifier('tostring'), [identifier('foo')]),
      '..',
      stringLiteral('bar')
    );

    expect(handleBinaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle loose equality`, () => {
    const given: BinaryExpression = {
      ...DEFAULT_NODE,
      type: 'BinaryExpression',
      operator: '==',
      left: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
      },
      right: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'bar',
      },
    };

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      identifier('foo'),
      '==',
      identifier('bar'),
      `ROBLOX CHECK: loose equality used upstream`
    );

    expect(handleBinaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle loose inequality`, () => {
    const given: BinaryExpression = {
      ...DEFAULT_NODE,
      type: 'BinaryExpression',
      operator: '!=',
      left: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
      },
      right: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'bar',
      },
    };

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      identifier('foo'),
      '~=',
      identifier('bar'),
      `ROBLOX CHECK: loose inequality used upstream`
    );

    expect(handleBinaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle strict equality`, () => {
    const given: BinaryExpression = {
      ...DEFAULT_NODE,
      type: 'BinaryExpression',
      operator: '===',
      left: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
      },
      right: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'bar',
      },
    };

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      identifier('foo'),
      '==',
      identifier('bar')
    );

    expect(handleBinaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle strict inequality`, () => {
    const given: BinaryExpression = {
      ...DEFAULT_NODE,
      type: 'BinaryExpression',
      operator: '!==',
      left: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
      },
      right: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'bar',
      },
    };

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      identifier('foo'),
      '~=',
      identifier('bar')
    );

    expect(handleBinaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle in operator with variable`, () => {
    const given: BinaryExpression = {
      ...DEFAULT_NODE,
      type: 'BinaryExpression',
      operator: 'in',
      left: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
      },
      right: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'bar',
      },
    };

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

    expect(handleBinaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle in operator with string literal`, () => {
    const given: BinaryExpression = {
      ...DEFAULT_NODE,
      type: 'BinaryExpression',
      operator: 'in',
      left: {
        ...DEFAULT_NODE,
        type: 'StringLiteral',
        value: 'foo',
      },
      right: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'bar',
      },
    };

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

    expect(handleBinaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle greater than operator`, () => {
    const given: BinaryExpression = {
      ...DEFAULT_NODE,
      type: 'BinaryExpression',
      operator: '>',
      left: {
        ...DEFAULT_NODE,
        type: 'StringLiteral',
        value: '3',
      },
      right: {
        ...DEFAULT_NODE,
        type: 'NumericLiteral',
        value: 4,
        extra: {
          raw: '4',
        },
      },
    };

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      stringLiteral('3'),
      '>',
      numericLiteral(4, '4'),
      `ROBLOX CHECK: operator '>' works only if either both arguments are strings or both are a number`
    );

    expect(handleBinaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle less than operator`, () => {
    const given: BinaryExpression = {
      ...DEFAULT_NODE,
      type: 'BinaryExpression',
      operator: '<',
      left: {
        ...DEFAULT_NODE,
        type: 'NumericLiteral',
        value: 3,
        extra: {
          raw: '3',
        },
      },
      right: {
        ...DEFAULT_NODE,
        type: 'NumericLiteral',
        value: 4,
        extra: {
          raw: '4',
        },
      },
    };

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      numericLiteral(3, '3'),
      '<',
      numericLiteral(4, '4'),
      `ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number`
    );

    expect(handleBinaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle greater than or equals operator`, () => {
    const given: BinaryExpression = {
      ...DEFAULT_NODE,
      type: 'BinaryExpression',
      operator: '>=',
      left: {
        ...DEFAULT_NODE,
        type: 'NumericLiteral',
        value: 3,
        extra: {
          raw: '3',
        },
      },
      right: {
        ...DEFAULT_NODE,
        type: 'NumericLiteral',
        value: 4,
        extra: {
          raw: '4',
        },
      },
    };

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      numericLiteral(3, '3'),
      '>=',
      numericLiteral(4, '4'),
      `ROBLOX CHECK: operator '>=' works only if either both arguments are strings or both are a number`
    );

    expect(handleBinaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle less than or equals operator`, () => {
    const given: BinaryExpression = {
      ...DEFAULT_NODE,
      type: 'BinaryExpression',
      operator: '<=',
      left: {
        ...DEFAULT_NODE,
        type: 'NumericLiteral',
        value: 3,
        extra: {
          raw: '3',
        },
      },
      right: {
        ...DEFAULT_NODE,
        type: 'NumericLiteral',
        value: 4,
        extra: {
          raw: '4',
        },
      },
    };

    const handleBinaryExpression = createBinaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaBinaryExpression = binaryExpression(
      numericLiteral(3, '3'),
      '<=',
      numericLiteral(4, '4'),
      `ROBLOX CHECK: operator '<=' works only if either both arguments are strings or both are a number`
    );

    expect(handleBinaryExpression.handler(source, given)).toEqual(expected);
  });
});
