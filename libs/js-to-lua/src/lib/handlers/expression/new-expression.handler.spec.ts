import {
  identifier as babelIdentifier,
  isIdentifier,
  newExpression as babelNewExpression,
} from '@babel/types';
import { withPolyfillExtra } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  memberExpression,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { mockNodeWithValueHandler } from '../../testUtils/mock-node';
import { createHandlerFunction } from '../../types';
import { createNewExpressionHandler } from './new-expression.handler';

describe('New Expression Handler', () => {
  const source = '';

  const mockedExpressionHandlerFn = jest.fn();

  const handleNewExpression = createNewExpressionHandler(
    mockedExpressionHandlerFn
  ).handler;

  beforeEach(() => {
    mockedExpressionHandlerFn
      .mockReset()
      .mockImplementation(mockNodeWithValueHandler);
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
});
