import {
  awaitExpression as babelAwaitExpression,
  identifier as babelIdentifier,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import {
  callExpression,
  identifier,
  memberExpression,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createAwaitExpressionHandler } from './await-expression.handler';

const source = '';

const handleAwaitExpression = createAwaitExpressionHandler(
  testUtils.mockNodeWithValueHandler
);

describe('Await Expression Handler', () => {
  it(`should return await call expression`, () => {
    const given = babelAwaitExpression(babelIdentifier('foo'));

    const expected = callExpression(
      memberExpression(
        mockNodeWithValue(babelIdentifier('foo')),
        ':',
        identifier('expect')
      ),
      []
    );

    expect(handleAwaitExpression.handler(source, {}, given)).toEqual(expected);
  });
});
