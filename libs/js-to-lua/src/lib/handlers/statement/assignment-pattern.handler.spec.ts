import {
  assignmentPattern as babelAssignmentPattern,
  identifier as babelIdentifier,
  Identifier,
  memberExpression,
  tsAnyKeyword as babelTsAnyKeyword,
  tsTypeAnnotation as babelTsTypeAnnotation,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  identifier,
  ifClause,
  ifStatement,
  LuaIdentifier,
  nilLiteral,
  nodeGroup,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createIdentifierHandler } from '../expression/identifier.handler';
import { createAssignmentPatternHandlerFunction } from './assignment-pattern.handler';

const { mockNodeWithValueHandler } = testUtils;

const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
  mockNodeWithValueHandler,
  mockNodeWithValueHandler
);

const source = '';

const withTypeAnnotation = (
  id: Identifier,
  typeAnnotation: Identifier['typeAnnotation']
): Identifier => ({
  ...id,
  typeAnnotation,
});

describe('Assignment Pattern Handler', () => {
  it(`should handle AssignmentPattern `, () => {
    const leftGiven = babelIdentifier('foo');
    const rightGiven = babelIdentifier('bar');
    const given = babelAssignmentPattern(leftGiven, rightGiven);

    const expected = ifStatement(
      ifClause(
        binaryExpression(mockNodeWithValue(leftGiven), '==', nilLiteral()),
        nodeGroup([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [mockNodeWithValue(leftGiven) as LuaIdentifier],
            [mockNodeWithValue(rightGiven)]
          ),
        ])
      )
    );

    expect(handleAssignmentPattern(source, {}, given)).toEqual(expected);
  });

  it(`should remove type annotation when handling AssignmentPattern `, () => {
    const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
      mockNodeWithValueHandler,
      createIdentifierHandler(mockNodeWithValueHandler).handler
    );

    const leftGiven = withTypeAnnotation(
      babelIdentifier('foo'),
      babelTsTypeAnnotation(babelTsAnyKeyword())
    );
    const rightGiven = babelIdentifier('bar');
    const given = babelAssignmentPattern(leftGiven, rightGiven);

    const expected = ifStatement(
      ifClause(
        binaryExpression(identifier('foo'), '==', nilLiteral()),
        nodeGroup([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('foo')],
            [mockNodeWithValue(rightGiven)]
          ),
        ])
      )
    );

    expect(handleAssignmentPattern(source, {}, given)).toEqual(expected);
  });

  it(`should return UnhandledStatement `, () => {
    const leftGiven = memberExpression(
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );
    const rightGiven = babelIdentifier('fizz');
    const given = babelAssignmentPattern(leftGiven, rightGiven);

    const expected = withTrailingConversionComment(
      unhandledStatement(),
      'ROBLOX TODO: Unhandled assignment pattern handling for type: "MemberExpression"'
    );

    expect(handleAssignmentPattern(source, {}, given)).toEqual(expected);
  });
});
