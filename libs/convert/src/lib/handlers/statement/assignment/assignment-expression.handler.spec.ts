import {
  assignmentExpression as babelAssignmentExpression,
  identifier as babelIdentifier,
} from '@babel/types';
import {
  BaseNodeAsStatementHandlerSymbol,
  combineAsStatementHandlers,
  forwardAsStatementHandlerRef,
  testUtils,
} from '@js-to-lua/handler-utils';

import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  functionExpression,
  LuaIdentifier,
  nodeGroup,
  returnStatement,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createAssignmentExpressionAsStatementHandlerFunction } from './assignment-expression-as-statement.handler';
import { createAssignmentExpressionHandlerFunction } from './assignment-expression.handler';

const { mockNodeWithValueHandler, mockNodeAsStatementWithValueHandler } =
  testUtils;

const handleAssignmentExpressionAsStatement =
  createAssignmentExpressionAsStatementHandlerFunction(
    mockNodeWithValueHandler,
    combineAsStatementHandlers(
      [
        {
          [BaseNodeAsStatementHandlerSymbol]: true,
          type: 'AssignmentExpression',
          handler: forwardAsStatementHandlerRef(
            () => handleAssignmentExpressionAsStatement
          ),
        },
      ],
      mockNodeAsStatementWithValueHandler
    ).handler,
    mockNodeWithValueHandler,
    mockNodeWithValueHandler,
    mockNodeWithValueHandler,
    mockNodeWithValueHandler
  );

const handleAssignmentExpression = createAssignmentExpressionHandlerFunction(
  mockNodeWithValueHandler,
  combineAsStatementHandlers(
    [
      {
        [BaseNodeAsStatementHandlerSymbol]: true,
        type: 'AssignmentExpression',
        handler: forwardAsStatementHandlerRef(
          () => handleAssignmentExpressionAsStatement
        ),
      },
    ],
    mockNodeAsStatementWithValueHandler
  ).handler,
  mockNodeWithValueHandler,
  mockNodeWithValueHandler,
  mockNodeWithValueHandler,
  mockNodeWithValueHandler
);

const source = '';

describe('Assignment Expression Handler', () => {
  it(`should wrap assignment statement with an IIFE `, () => {
    const leftGiven = babelIdentifier('foo');
    const rightGiven = babelIdentifier('bar');
    const given = babelAssignmentExpression('=', leftGiven, rightGiven);

    const expected = callExpression(
      functionExpression(
        [],
        nodeGroup([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [mockNodeWithValue(leftGiven) as LuaIdentifier],
            [mockNodeWithValue(rightGiven)]
          ),
          returnStatement(mockNodeWithValue(leftGiven)),
        ])
      ),
      []
    );

    expect(handleAssignmentExpression.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle wrap chained AssignmentStatement with an IIFE`, () => {
    const leftGiven = babelIdentifier('foo');
    const middleGiven = babelIdentifier('bar');
    const rightGiven = babelIdentifier('baz');
    const given = babelAssignmentExpression(
      '=',
      leftGiven,
      babelAssignmentExpression('=', middleGiven, rightGiven)
    );

    const expected = callExpression(
      functionExpression(
        [],
        nodeGroup([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [mockNodeWithValue(middleGiven) as LuaIdentifier],
            [mockNodeWithValue(rightGiven)]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [mockNodeWithValue(leftGiven) as LuaIdentifier],
            [mockNodeWithValue(middleGiven)]
          ),
          returnStatement(mockNodeWithValue(leftGiven)),
        ])
      ),
      []
    );

    expect(handleAssignmentExpression.handler(source, {}, given)).toEqual(
      expected
    );
  });
});
