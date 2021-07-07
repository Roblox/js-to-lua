import { createReturnStatementHandler } from './return-statement.handler';
import {
  assignmentExpression as babelAssignmentExpression,
  identifier as babelIdentifier,
  returnStatement as babelReturnStatement,
} from '@babel/types';
import { nodeGroup, returnStatement } from '@js-to-lua/lua-types';
import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../../testUtils/mock-node';

jest.mock('../../utils/get-return-expressions', () => ({
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

    const actual = returnStatementHandler.handler(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it(`should handle simple ReturnStatement `, () => {
    const given = babelReturnStatement(babelIdentifier('foo'));
    const expected = returnStatement(mockNodeWithValue(babelIdentifier('foo')));

    const actual = returnStatementHandler.handler(source, {}, given);
    expect(actual).toEqual(expected);
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

    const actual = returnStatementHandler.handler(source, {}, given);
    expect(actual).toEqual(expected);
  });
});
