import {
  identifier as babelIdentifier,
  anyTypeAnnotation as babelAnyTypeAnnotation,
  typeAnnotation as babelTypeAnnotation,
  typeCastExpression as babelTypeCastExpression,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';

import { typeCastExpression } from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createFlowTypeCastExpressionHandler } from './flow-type-cast.handler';

const { mockNodeWithValueHandler } = testUtils;

describe('TS as Expression Handler', () => {
  const source = '';

  const handleFlowTypeCastExpression = createFlowTypeCastExpressionHandler(
    mockNodeWithValueHandler,
    mockNodeWithValueHandler
  ).handler;

  it('should handle TypeCastExpression', () => {
    const given = babelTypeCastExpression(
      babelIdentifier('foo'),
      babelTypeAnnotation(babelAnyTypeAnnotation())
    );

    const expected = typeCastExpression(
      mockNodeWithValue(babelIdentifier('foo')),
      mockNodeWithValue(babelAnyTypeAnnotation())
    );

    expect(handleFlowTypeCastExpression(source, {}, given)).toEqual(expected);
  });
});
