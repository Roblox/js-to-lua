import { createNewExpressionHandler } from './new-expression.handler';
import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../../testUtils/mock-node';
import {
  newExpression as babelNewExpression,
  identifier as babelIdentifier,
  isIdentifier,
} from '@babel/types';
import {
  callExpression,
  identifier,
  memberExpression,
  withPolyfillExtra,
} from '@js-to-lua/lua-types';
import { createHandlerFunction } from '../../types';

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
