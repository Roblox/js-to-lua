import {
  assignmentPattern as babelAssignmentPattern,
  identifier as babelIdentifier,
} from '@babel/types';
import {
  assignmentStatement,
  binaryExpression,
  ifClause,
  ifStatement,
  LuaIdentifier,
  nilLiteral,
} from '@js-to-lua/lua-types';
import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../../testUtils/mock-node';
import { createAssignmentPatternHandlerFunction } from './assignment-pattern.handler';

const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
  mockNodeWithValueHandler,
  mockNodeWithValueHandler
);

const source = '';

describe('Assignment Pattern Handler', () => {
  it(`should handle AssignmentPattern `, () => {
    const leftGiven = babelIdentifier('foo');
    const rightGiven = babelIdentifier('bar');
    const given = babelAssignmentPattern(leftGiven, rightGiven);

    const expected = ifStatement(
      ifClause(
        binaryExpression(mockNodeWithValue(leftGiven), '==', nilLiteral()),
        [
          assignmentStatement(
            [mockNodeWithValue(leftGiven) as LuaIdentifier],
            [mockNodeWithValue(rightGiven)]
          ),
        ]
      )
    );

    expect(handleAssignmentPattern(source, {}, given)).toEqual(expected);
  });
});
