import { UnaryExpression } from '@babel/types';
import {
  bit32Identifier,
  booleanLiteral,
  booleanMethod,
  callExpression,
  identifier,
  LuaCallExpression,
  LuaUnaryDeleteExpression,
  LuaUnaryExpression,
  LuaUnaryNegationExpression,
  LuaUnaryVoidExpression,
  memberExpression,
  numericLiteral,
  unaryDeleteExpression,
  unaryExpression,
  unaryNegationExpression,
  unaryVoidExpression,
  withConversionComment,
} from '@js-to-lua/lua-types';
import { forwardHandlerRef } from '../utils/forward-handler-ref';
import { handleExpression } from './expression-statement.handler';
import { createUnaryExpressionHandler } from './unary-expression.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

const source = '';

describe('Unary Expression Handler', () => {
  it(`should handle typeof operator`, () => {
    const given: UnaryExpression = {
      ...DEFAULT_NODE,
      type: 'UnaryExpression',
      operator: 'typeof',
      prefix: true,
      argument: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
      },
    };

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaCallExpression = callExpression(identifier('typeof'), [
      identifier('foo'),
    ]);

    expect(handleUnaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle plus operator`, () => {
    const given: UnaryExpression = {
      ...DEFAULT_NODE,
      type: 'UnaryExpression',
      operator: '+',
      prefix: true,
      argument: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
      },
    };

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaCallExpression = callExpression(identifier('tonumber'), [
      identifier('foo'),
    ]);

    expect(handleUnaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle minus operator`, () => {
    const given: UnaryExpression = {
      ...DEFAULT_NODE,
      type: 'UnaryExpression',
      operator: '-',
      prefix: true,
      argument: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
      },
    };

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaUnaryExpression = unaryExpression(
      '-',
      identifier('foo')
    );

    expect(handleUnaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle void operator`, () => {
    const given: UnaryExpression = {
      ...DEFAULT_NODE,
      type: 'UnaryExpression',
      operator: 'void',
      prefix: true,
      argument: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
      },
    };

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaUnaryVoidExpression = unaryVoidExpression(
      identifier('foo')
    );

    expect(handleUnaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle negation operator`, () => {
    const given: UnaryExpression = {
      ...DEFAULT_NODE,
      type: 'UnaryExpression',
      operator: '!',
      prefix: true,
      argument: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
        start: 0,
        end: 1,
      },
    };

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaUnaryNegationExpression = unaryNegationExpression(
      callExpression(booleanMethod('toJSBoolean'), [identifier('foo')])
    );

    expect(handleUnaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle negation operator of BooleanLiteral`, () => {
    const given: UnaryExpression = {
      ...DEFAULT_NODE,
      type: 'UnaryExpression',
      operator: '!',
      prefix: true,
      argument: {
        ...DEFAULT_NODE,
        type: 'BooleanLiteral',
        value: true,
      },
    };

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaUnaryNegationExpression = unaryNegationExpression(
      booleanLiteral(true)
    );

    expect(handleUnaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle delete operator`, () => {
    const given: UnaryExpression = {
      ...DEFAULT_NODE,
      type: 'UnaryExpression',
      operator: 'delete',
      prefix: true,
      argument: {
        ...DEFAULT_NODE,
        type: 'Identifier',
        name: 'foo',
      },
    };

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaUnaryDeleteExpression = unaryDeleteExpression(
      identifier('foo')
    );

    expect(handleUnaryExpression.handler(source, given)).toEqual(expected);
  });

  it(`should handle ~ operator`, () => {
    const given: UnaryExpression = {
      ...DEFAULT_NODE,
      type: 'UnaryExpression',
      operator: '~',
      prefix: true,
      argument: {
        ...DEFAULT_NODE,
        type: 'NumericLiteral',
        extra: {
          rawValue: 5,
          raw: '5',
        },
        value: 5,
      },
    };

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaCallExpression = withConversionComment(
      callExpression(
        memberExpression(bit32Identifier(), '.', identifier('bnot')),
        [numericLiteral(5, '5')]
      ),
      'ROBLOX CHECK: `bit32.bnot` clamps arguments and result to [0,2^32 - 1]'
    );

    expect(handleUnaryExpression.handler(source, given)).toEqual(expected);
  });
});
