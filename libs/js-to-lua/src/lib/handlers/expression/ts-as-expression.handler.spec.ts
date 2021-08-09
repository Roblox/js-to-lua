import { createTsAsExpressionHandler } from './ts-as-expression.handler';
import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../../testUtils/mock-node';
import {
  tsAsExpression as babelTsAsExpression,
  identifier as babelIdentifier,
  tsAnyKeyword as babelTsAnyKeyword,
} from '@babel/types';
import { typeCastExpression } from '@js-to-lua/lua-types';

describe('TS as Expression Handler', () => {
  const source = '';

  const handleTsAsExpression = createTsAsExpressionHandler(
    mockNodeWithValueHandler,
    mockNodeWithValueHandler
  ).handler;

  it('should handle TSAsExpression', () => {
    const given = babelTsAsExpression(
      babelIdentifier('foo'),
      babelTsAnyKeyword()
    );

    const expected = typeCastExpression(
      mockNodeWithValue(babelIdentifier('foo')),
      mockNodeWithValue(babelTsAnyKeyword())
    );

    expect(handleTsAsExpression(source, {}, given)).toEqual(expected);
  });
});
