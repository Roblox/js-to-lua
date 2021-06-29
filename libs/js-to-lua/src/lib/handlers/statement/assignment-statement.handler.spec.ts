import {
  assignmentExpression as babelAssignmentExpression,
  identifier as babelIdentifier,
} from '@babel/types';
import {
  assignmentStatement,
  LuaIdentifier,
  nodeGroup,
} from '@js-to-lua/lua-types';
import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../../testUtils/mock-node';
import { createAssignmentStatementHandlerFunction } from './assignment-statement.handler';
import { combineHandlers } from '../../utils/combine-handlers';
import { forwardHandlerRef } from '../../utils/forward-handler-ref';

const handleAssignmentStatement = createAssignmentStatementHandlerFunction(
  combineHandlers(
    [
      {
        type: 'AssignmentExpression',
        handler: forwardHandlerRef(() => handleAssignmentStatement),
      },
    ],
    mockNodeWithValueHandler
  ).handler,
  mockNodeWithValueHandler
);

const source = '';

describe('Assignment Statement Handler', () => {
  it(`should handle simple AssignmentStatement `, () => {
    const leftGiven = babelIdentifier('foo');
    const rightGiven = babelIdentifier('bar');
    const given = babelAssignmentExpression('=', leftGiven, rightGiven);

    const expected = assignmentStatement(
      [mockNodeWithValue(leftGiven) as LuaIdentifier],
      [mockNodeWithValue(rightGiven)]
    );

    expect(handleAssignmentStatement.handler(source, given)).toEqual(expected);
  });

  it(`should handle chained AssignmentStatement `, () => {
    const leftGiven = babelIdentifier('foo');
    const middleGiven = babelIdentifier('bar');
    const rightGiven = babelIdentifier('baz');
    const given = babelAssignmentExpression(
      '=',
      leftGiven,
      babelAssignmentExpression('=', middleGiven, rightGiven)
    );

    const expected = nodeGroup([
      assignmentStatement(
        [mockNodeWithValue(middleGiven) as LuaIdentifier],
        [mockNodeWithValue(rightGiven)]
      ),
      assignmentStatement(
        [mockNodeWithValue(leftGiven) as LuaIdentifier],
        [mockNodeWithValue(middleGiven)]
      ),
    ]);

    expect(handleAssignmentStatement.handler(source, given)).toEqual(expected);
  });
});
