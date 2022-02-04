import {
  identifier as babelIdentifier,
  tsAnyKeyword as babelTsAnyKeyword,
  tsAsExpression as babelTsAsExpression,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';

import { typeCastExpression } from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createTsAsExpressionHandler } from './ts-as-expression.handler';

const { mockNodeWithValueHandler } = testUtils;

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
