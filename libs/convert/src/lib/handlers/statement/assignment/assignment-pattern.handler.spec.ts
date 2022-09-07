import * as Babel from '@babel/types';
import { createHandlerFunction, testUtils } from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  elseExpressionClause,
  identifier,
  ifElseExpression,
  ifExpressionClause,
  LuaIdentifier,
  nilLiteral,
  typeAnnotation,
  typeAny,
  typeString,
  unhandledStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createAssignmentPatternHandlerFunction } from './assignment-pattern.handler';

const { mockNodeWithValueHandler } = testUtils;

const mockedHandleIdentifier = jest.fn(
  mockNodeWithValue<LuaIdentifier, Babel.Identifier>
);
const handleIdentifier = createHandlerFunction<LuaIdentifier, Babel.Identifier>(
  (source, config, node) => mockedHandleIdentifier(node)
);

const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
  mockNodeWithValueHandler,
  handleIdentifier
);

const source = '';

const withTypeAnnotation = (
  id: Babel.Identifier,
  typeAnnotation: Babel.Identifier['typeAnnotation']
): Babel.Identifier => ({
  ...id,
  typeAnnotation,
});

describe('Assignment Pattern Handler', () => {
  beforeEach(() => {
    mockedHandleIdentifier.mockImplementation(mockNodeWithValue);
  });

  it(`should handle AssignmentPattern `, () => {
    mockedHandleIdentifier.mockImplementation((node) => identifier(node.name));

    const leftGiven = Babel.identifier('foo');
    const rightGiven = Babel.identifier('bar');
    const given = Babel.assignmentPattern(leftGiven, rightGiven);

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(
          identifier('foo', typeAnnotation(typeAny()))
        ),
      ],
      [
        variableDeclaratorValue(
          ifElseExpression(
            ifExpressionClause(
              binaryExpression(identifier('foo_'), '~=', nilLiteral()),
              identifier('foo_')
            ),
            elseExpressionClause(mockNodeWithValue(rightGiven))
          )
        ),
      ]
    );

    expect(handleAssignmentPattern(source, {}, given)).toEqual(expected);
  });

  it(`should preserve type annotation when handling AssignmentPattern `, () => {
    mockedHandleIdentifier.mockImplementation((node) =>
      identifier(node.name, typeAnnotation(typeString()))
    );

    const leftGiven = withTypeAnnotation(
      Babel.identifier('foo'),
      Babel.tsTypeAnnotation(Babel.tsStringKeyword())
    );
    const rightGiven = Babel.identifier('bar');
    const given = Babel.assignmentPattern(leftGiven, rightGiven);

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier({
          ...identifier('foo'),
          typeAnnotation: typeAnnotation(typeString()),
        }),
      ],
      [
        variableDeclaratorValue(
          ifElseExpression(
            ifExpressionClause(
              binaryExpression(identifier('foo_'), '~=', nilLiteral()),
              identifier('foo_')
            ),
            elseExpressionClause(mockNodeWithValue(rightGiven))
          )
        ),
      ]
    );

    expect(handleAssignmentPattern(source, {}, given)).toEqual(expected);
  });

  it(`should return UnhandledStatement `, () => {
    const leftGiven = Babel.memberExpression(
      Babel.identifier('foo'),
      Babel.identifier('bar')
    );
    const rightGiven = Babel.identifier('fizz');
    const given = Babel.assignmentPattern(leftGiven, rightGiven);

    const expected = withTrailingConversionComment(
      unhandledStatement(),
      'ROBLOX TODO: Unhandled assignment pattern handling for type: "MemberExpression"'
    );

    expect(handleAssignmentPattern(source, {}, given)).toEqual(expected);
  });
});
