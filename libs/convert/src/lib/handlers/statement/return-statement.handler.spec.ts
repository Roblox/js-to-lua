import {
  assignmentExpression as babelAssignmentExpression,
  identifier as babelIdentifier,
  returnStatement as babelReturnStatement,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { nodeGroup, returnStatement } from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createReturnStatementHandler } from './return-statement.handler';

const { mockNodeWithValueHandler } = testUtils;

jest.mock('@js-to-lua/lua-conversion-utils', () => ({
  getReturnExpressions: jest
    .fn()
    .mockImplementation((node) => getReturnExpressions(node)),
}));

const getReturnExpressions = jest.fn().mockImplementation((node) => [node]);

const source = '';

describe('Return Statement Handler', () => {
  const returnStatementHandler = createReturnStatementHandler(
    mockNodeWithValueHandler,
    mockNodeWithValueHandler
  );

  it(`should handle empty ReturnStatement `, () => {
    const given = babelReturnStatement();
    const expected = returnStatement();

    expect(returnStatementHandler.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle simple ReturnStatement `, () => {
    const given = babelReturnStatement(babelIdentifier('foo'));
    const expected = returnStatement(mockNodeWithValue(babelIdentifier('foo')));

    expect(returnStatementHandler.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle ReturnStatement that yields another statement`, () => {
    getReturnExpressions.mockReturnValue([mockNodeWithValue('mockStatement')]);
    const argumentGiven = babelAssignmentExpression(
      '=',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );
    const given = babelReturnStatement(argumentGiven);
    const expected = nodeGroup([
      mockNodeWithValue(argumentGiven),
      returnStatement(mockNodeWithValue('mockStatement')),
    ]);

    expect(returnStatementHandler.handler(source, {}, given)).toEqual(expected);
  });
});
