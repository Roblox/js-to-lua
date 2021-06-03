import { UnaryExpression } from '@babel/types';
import {
  callExpression,
  identifier,
  LuaCallExpression,
  LuaUnaryDeleteExpression,
  LuaUnaryExpression,
  LuaUnaryNegationExpression,
  LuaUnaryVoidExpression,
  unaryDeleteExpression,
  unaryExpression,
  unaryNegationExpression,
  unaryVoidExpression,
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

    expect(handleUnaryExpression.handler(given)).toEqual(expected);
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

    expect(handleUnaryExpression.handler(given)).toEqual(expected);
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

    expect(handleUnaryExpression.handler(given)).toEqual(expected);
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

    expect(handleUnaryExpression.handler(given)).toEqual(expected);
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
      identifier('foo'),
      {
        argumentStart: 0,
        argumentEnd: 1,
      }
    );

    expect(handleUnaryExpression.handler(given)).toEqual(expected);
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

    expect(handleUnaryExpression.handler(given)).toEqual(expected);
  });
});
