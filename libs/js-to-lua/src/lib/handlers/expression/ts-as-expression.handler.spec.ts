import {
  identifier as babelIdentifier,
  tsAnyKeyword as babelTsAnyKeyword,
  tsAsExpression as babelTsAsExpression,
} from '@babel/types';
import { typeCastExpression } from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { mockNodeWithValueHandler } from '../../testUtils/mock-node';
import { createTsAsExpressionHandler } from './ts-as-expression.handler';

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
