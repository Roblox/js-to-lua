import {
  identifier as babelIdentifier,
  throwStatement as babelThrowStatement,
} from '@babel/types';
import {
  callExpression,
  expressionStatement,
  identifier,
} from '@js-to-lua/lua-types';
import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../../testUtils/mock-node';
import { createThrowStatementHandler } from './throw-statement.handler';

const source = '';

describe('Throw Statement Handler', () => {
  const handleThrowStatement = createThrowStatementHandler(
    mockNodeWithValueHandler
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
