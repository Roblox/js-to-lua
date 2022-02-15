import {
  identifier as babelIdentifier,
  throwStatement as babelThrowStatement,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import {
  callExpression,
  expressionStatement,
  identifier,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createThrowStatementHandler } from './throw-statement.handler';

const source = '';

describe('Throw Statement Handler', () => {
  const handleThrowStatement = createThrowStatementHandler(
    testUtils.mockNodeWithValueHandler
  ).handler;

  it(`should handle ThrowStatement `, () => {
    const given = babelThrowStatement(babelIdentifier('foo'));
    const expected = expressionStatement(
      callExpression(identifier('error'), [
        mockNodeWithValue(babelIdentifier('foo')),
      ])
    );

    expect(handleThrowStatement(source, {}, given)).toEqual(expected);
  });
});
