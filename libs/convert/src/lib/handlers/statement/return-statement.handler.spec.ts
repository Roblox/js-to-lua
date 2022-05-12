import {
  assignmentExpression as babelAssignmentExpression,
  Expression,
  identifier as babelIdentifier,
  returnStatement as babelReturnStatement,
} from '@babel/types';
import {
  asStatementReturnTypeWithIdentifier,
  createAsStatementHandlerFunction,
  testUtils,
} from '@js-to-lua/handler-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  identifier,
  LuaStatement,
  nodeGroup,
  returnStatement,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createReturnStatementHandler } from './return-statement.handler';

const { mockNodeWithValueHandler, mockNodeAsStatementWithValueHandler } =
  testUtils;

const handleExpressionAsStatement = jest
  .fn()
  .mockImplementation(mockNodeAsStatementWithValueHandler);

const source = '';

describe('Return Statement Handler', () => {
  const returnStatementHandler = createReturnStatementHandler(
    mockNodeWithValueHandler,
    createAsStatementHandlerFunction<LuaStatement, Expression>(
      handleExpressionAsStatement
    )
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
    handleExpressionAsStatement.mockImplementationOnce(() =>
      asStatementReturnTypeWithIdentifier(
        [
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('foo')],
            [identifier('bar')]
          ),
        ],
        [],
        identifier('foo')
      )
    );
    const argumentGiven = babelAssignmentExpression(
      '=',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );
    const given = babelReturnStatement(argumentGiven);
    const expected = nodeGroup([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [identifier('bar')]
      ),
      returnStatement(identifier('foo')),
    ]);

    expect(returnStatementHandler.handler(source, {}, given)).toEqual(expected);
  });
});
