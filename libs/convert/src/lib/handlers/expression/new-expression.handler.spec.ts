import {
  identifier as babelIdentifier,
  isIdentifier,
  newExpression as babelNewExpression,
} from '@babel/types';
import { createHandlerFunction, testUtils } from '@js-to-lua/handler-utils';
import {
  dateTimeMethodCall,
  withPolyfillExtra,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  memberExpression,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createNewExpressionHandler } from './new-expression.handler';

const { mockNodeWithValueHandler } = testUtils;

describe('New Expression Handler', () => {
  const source = '';

  const mockedExpressionHandlerFn = jest.fn();

  const handleNewExpression = createNewExpressionHandler(
    mockedExpressionHandlerFn
  ).handler;

  beforeEach(() => {
    mockedExpressionHandlerFn
      .mockReset()
      .mockImplementation(testUtils.mockNodeWithValueHandler);
  });

  it('handle new expression without params', () => {
    const given = babelNewExpression(babelIdentifier('ClassConstructor'), []);

    const expected = callExpression(
      memberExpression(
        mockNodeWithValue(babelIdentifier('ClassConstructor')),
        '.',
        identifier('new')
      ),
      []
    );

    expect(handleNewExpression(source, {}, given)).toEqual(expected);
  });

  it('handle new expression with params', () => {
    const given = babelNewExpression(babelIdentifier('ClassConstructor'), [
      babelIdentifier('foo'),
      babelIdentifier('bar'),
    ]);

    const expected = callExpression(
      memberExpression(
        mockNodeWithValue(babelIdentifier('ClassConstructor')),
        '.',
        identifier('new')
      ),
      [
        mockNodeWithValue(babelIdentifier('foo')),
        mockNodeWithValue(babelIdentifier('bar')),
      ]
    );

    expect(handleNewExpression(source, {}, given)).toEqual(expected);
  });

  it('handle new expression with Map (and add polyfill extra)', () => {
    const given = babelNewExpression(babelIdentifier('Map'), []);

    mockedExpressionHandlerFn.mockImplementation(
      createHandlerFunction((source, config, node) =>
        isIdentifier(node) && node.name === 'Map'
          ? identifier('Map')
          : mockNodeWithValueHandler(source, config, node)
      )
    );

    const expected = withPolyfillExtra('Map')(
      callExpression(
        memberExpression(identifier('Map'), '.', identifier('new')),
        []
      )
    );

    expect(handleNewExpression(source, {}, given)).toEqual(expected);
  });

  it('should handle new Date', () => {
    const given = babelNewExpression(babelIdentifier('Date'), []);

    const expected = dateTimeMethodCall('now');
    expect(handleNewExpression(source, {}, given)).toEqual(expected);
  });
});
