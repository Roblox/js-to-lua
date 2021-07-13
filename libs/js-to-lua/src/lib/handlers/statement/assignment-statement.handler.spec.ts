import {
  arrayPattern,
  AssignmentExpression,
  assignmentExpression as babelAssignmentExpression,
  identifier as babelIdentifier,
  objectPattern,
  objectProperty,
  restElement,
} from '@babel/types';
import {
  AssignmentStatement,
  assignmentStatement,
  callExpression,
  identifier,
  LuaIdentifier,
  LuaNodeGroup,
  memberExpression,
  nodeGroup,
  numericLiteral,
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
  mockNodeWithValueHandler,
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

    expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
      expected
    );
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

    expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
      expected
    );
  });
  it(`should handle array destructuring`, () => {
    const given: AssignmentExpression = babelAssignmentExpression(
      '=',
      arrayPattern([babelIdentifier('foo'), babelIdentifier('bar')]),
      babelIdentifier('baz')
    );

    const expected: LuaNodeGroup = nodeGroup([
      assignmentStatement(
        [
          mockNodeWithValue(identifier('foo')),
          mockNodeWithValue(identifier('bar')),
        ],
        [
          callExpression(identifier('table.unpack'), [
            mockNodeWithValue(identifier('baz')),
            numericLiteral(1),
            numericLiteral(2),
          ]),
        ]
      ),
    ]);

    expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle array destructuring with nested arrays`, () => {
    const given: AssignmentExpression = babelAssignmentExpression(
      '=',
      arrayPattern([
        babelIdentifier('foo'),
        arrayPattern([babelIdentifier('bar'), babelIdentifier('baz')]),
      ]),
      babelIdentifier('fizz')
    );

    const expected: LuaNodeGroup = nodeGroup([
      assignmentStatement(
        [mockNodeWithValue(identifier('foo'))],
        [
          callExpression(identifier('table.unpack'), [
            mockNodeWithValue(identifier('fizz')),
            numericLiteral(1),
            numericLiteral(1),
          ]),
        ]
      ),
      assignmentStatement(
        [
          mockNodeWithValue(identifier('bar')),
          mockNodeWithValue(identifier('baz')),
        ],
        [
          callExpression(identifier('table.unpack'), [
            callExpression(identifier('table.unpack'), [
              mockNodeWithValue(identifier('fizz')),
              numericLiteral(2),
              numericLiteral(2),
            ]),
            numericLiteral(1),
            numericLiteral(2),
          ]),
        ]
      ),
    ]);

    expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle array destructuring with rest element`, () => {
    const given: AssignmentExpression = babelAssignmentExpression(
      '=',
      arrayPattern([
        babelIdentifier('foo'),
        restElement(babelIdentifier('bar')),
      ]),
      babelIdentifier('baz')
    );

    const expected: LuaNodeGroup = nodeGroup([
      assignmentStatement(
        [mockNodeWithValue(identifier('foo'))],
        [
          callExpression(identifier('table.unpack'), [
            mockNodeWithValue(identifier('baz')),
            numericLiteral(1),
            numericLiteral(1),
          ]),
        ]
      ),
      assignmentStatement(
        [mockNodeWithValue(identifier('bar'))],
        [
          callExpression(identifier('table.pack'), [
            callExpression(identifier('table.unpack'), [
              mockNodeWithValue(identifier('baz')),
              numericLiteral(2),
            ]),
          ]),
        ]
      ),
    ]);

    expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle object destructuring`, () => {
    const given: AssignmentExpression = babelAssignmentExpression(
      '=',
      objectPattern([
        objectProperty(babelIdentifier('foo'), babelIdentifier('foo')),
        objectProperty(babelIdentifier('bar'), babelIdentifier('bar')),
      ]),
      babelIdentifier('baz')
    );

    const expected: AssignmentStatement = assignmentStatement(
      [identifier('foo'), identifier('bar')],
      [
        memberExpression(
          mockNodeWithValue(identifier('baz')),
          '.',
          identifier('foo')
        ),
        memberExpression(
          mockNodeWithValue(identifier('baz')),
          '.',
          identifier('bar')
        ),
      ]
    );

    expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle object destructuring with aliases`, () => {
    const given: AssignmentExpression = babelAssignmentExpression(
      '=',
      objectPattern([
        objectProperty(babelIdentifier('foo'), babelIdentifier('fun')),
        objectProperty(babelIdentifier('bar'), babelIdentifier('bat')),
      ]),
      babelIdentifier('baz')
    );

    const expected: AssignmentStatement = assignmentStatement(
      [identifier('fun'), identifier('bat')],
      [
        memberExpression(
          mockNodeWithValue(identifier('baz')),
          '.',
          identifier('foo')
        ),
        memberExpression(
          mockNodeWithValue(identifier('baz')),
          '.',
          identifier('bar')
        ),
      ]
    );

    expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle object destructuring with nested object pattern`, () => {
    const given: AssignmentExpression = babelAssignmentExpression(
      '=',
      objectPattern([
        objectProperty(
          babelIdentifier('foo'),
          objectPattern([
            objectProperty(babelIdentifier('bar'), babelIdentifier('bar')),
            objectProperty(babelIdentifier('baz'), babelIdentifier('baz')),
          ])
        ),
      ]),
      babelIdentifier('fizz')
    );

    const expected: AssignmentStatement = assignmentStatement(
      [identifier('bar'), identifier('baz')],
      [
        memberExpression(
          memberExpression(
            mockNodeWithValue(identifier('fizz')),
            '.',
            identifier('foo')
          ),
          '.',
          identifier('bar')
        ),
        memberExpression(
          memberExpression(
            mockNodeWithValue(identifier('fizz')),
            '.',
            identifier('foo')
          ),
          '.',
          identifier('baz')
        ),
      ]
    );

    expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
      expected
    );
  });
});
