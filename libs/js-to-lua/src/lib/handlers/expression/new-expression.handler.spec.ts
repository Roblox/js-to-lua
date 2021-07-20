import { createNewExpressionHandler } from './new-expression.handler';
import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../../testUtils/mock-node';
import {
  newExpression as babelNewExpression,
  identifier as babelIdentifier,
} from '@babel/types';
import {
  callExpression,
  identifier,
  memberExpression,
} from '@js-to-lua/lua-types';

describe('New Expression Handler', () => {
  const source = '';
  const handleNewExpression = createNewExpressionHandler(
    mockNodeWithValueHandler
  ).handler;

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
});
