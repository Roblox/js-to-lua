import {
  identifier as babelIdentifier,
  tsNonNullExpression as babelTsNonNullExpression,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';

import { typeAny, typeCastExpression } from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createTsNonNullExpressionHandler } from './ts-non-null-expression.handler';

const { mockNodeWithValueHandler } = testUtils;

describe('TS Non Null Expression Handler', () => {
  const source = '';

  const handleTsAsExpression = createTsNonNullExpressionHandler(
    mockNodeWithValueHandler
  ).handler;

  it('should handle TSNonNullExpression', () => {
    const given = babelTsNonNullExpression(babelIdentifier('foo'));

    const expected = typeCastExpression(
      mockNodeWithValue(babelIdentifier('foo')),
      typeAny()
    );

    expect(handleTsAsExpression(source, {}, given)).toEqual(expected);
  });

  it('should handle double TSNonNullExpression', () => {
    const given = babelTsNonNullExpression(
      babelTsNonNullExpression(babelIdentifier('foo'))
    );

    const expected = typeCastExpression(
      mockNodeWithValue(babelIdentifier('foo')),
      typeAny()
    );

    expect(handleTsAsExpression(source, {}, given)).toEqual(expected);
  });
});
