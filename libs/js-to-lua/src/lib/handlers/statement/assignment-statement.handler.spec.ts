import {
  arrayPattern,
  AssignmentExpression,
  assignmentExpression as babelAssignmentExpression,
  identifier as babelIdentifier,
  objectPattern,
  objectProperty,
  restElement,
  StringLiteral,
  stringLiteral as babelStringLiteral,
} from '@babel/types';
import {
  combineHandlers,
  createHandlerFunction,
  EmptyConfig,
  forwardHandlerRef,
  testUtils,
} from '@js-to-lua/handler-utils';
import { stringInferableExpression } from '@js-to-lua/lua-conversion-utils';
import {
  AssignmentStatement,
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  identifier,
  LuaIdentifier,
  LuaNodeGroup,
  memberExpression,
  nodeGroup,
  numericLiteral,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createAssignmentStatementHandlerFunction } from './assignment-statement.handler';

const { mockNodeWithValueHandler } = testUtils;

const handleAssignmentStatement = createAssignmentStatementHandlerFunction(
  combineHandlers(
    [
      {
        type: 'AssignmentExpression',
        handler: forwardHandlerRef(() => handleAssignmentStatement),
      },
      {
        type: 'StringLiteral',
        handler: createHandlerFunction(
          (source: string, config: EmptyConfig, node: StringLiteral) =>
            stringInferableExpression(mockNodeWithValue(node))
        ),
      },
    ],
    mockNodeWithValueHandler
  ).handler,
  mockNodeWithValueHandler,
  mockNodeWithValueHandler,
  mockNodeWithValueHandler
);

const source = '';

describe('Assignment Statement Handler', () => {
  describe(`= operator`, () => {
    it('should handle simple AssignmentStatement', () => {
      const leftGiven = babelIdentifier('foo');
      const rightGiven = babelIdentifier('bar');
      const given = babelAssignmentExpression('=', leftGiven, rightGiven);

      const expected = assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [mockNodeWithValue(leftGiven) as LuaIdentifier],
        [mockNodeWithValue(rightGiven)]
      );

      expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it('should handle chained AssignmentStatement', () => {
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
          AssignmentStatementOperatorEnum.EQ,
          [mockNodeWithValue(middleGiven) as LuaIdentifier],
          [mockNodeWithValue(rightGiven)]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
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
          AssignmentStatementOperatorEnum.EQ,
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
          AssignmentStatementOperatorEnum.EQ,
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
          AssignmentStatementOperatorEnum.EQ,
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
          AssignmentStatementOperatorEnum.EQ,
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
          AssignmentStatementOperatorEnum.EQ,
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
        AssignmentStatementOperatorEnum.EQ,
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
        AssignmentStatementOperatorEnum.EQ,
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
        AssignmentStatementOperatorEnum.EQ,
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

  describe('+= operator', () => {
    it('should handle simple AssignmentStatement', () => {
      const leftGiven = babelIdentifier('foo');
      const rightGiven = babelIdentifier('bar');
      const given = babelAssignmentExpression('+=', leftGiven, rightGiven);

      const expected = assignmentStatement(
        AssignmentStatementOperatorEnum.ADD,
        [mockNodeWithValue(leftGiven) as LuaIdentifier],
        [mockNodeWithValue(rightGiven)]
      );

      expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it('should handle simple AssignmentStatement with string literal on the right', () => {
      const leftGiven = babelIdentifier('foo');
      const rightGiven = babelStringLiteral('bar');
      const given = babelAssignmentExpression('+=', leftGiven, rightGiven);

      const expected = assignmentStatement(
        AssignmentStatementOperatorEnum.CONCAT,
        [
          stringInferableExpression(
            mockNodeWithValue(leftGiven)
          ) as LuaIdentifier,
        ],
        [stringInferableExpression(mockNodeWithValue(rightGiven))]
      );

      expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it('should handle chained AssignmentStatement', () => {
      const leftGiven = babelIdentifier('foo');
      const middleGiven = babelIdentifier('bar');
      const rightGiven = babelIdentifier('baz');
      const given = babelAssignmentExpression(
        '+=',
        leftGiven,
        babelAssignmentExpression('+=', middleGiven, rightGiven)
      );

      const expected = nodeGroup([
        assignmentStatement(
          AssignmentStatementOperatorEnum.ADD,
          [mockNodeWithValue(middleGiven) as LuaIdentifier],
          [mockNodeWithValue(rightGiven)]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.ADD,
          [mockNodeWithValue(leftGiven) as LuaIdentifier],
          [mockNodeWithValue(middleGiven)]
        ),
      ]);

      expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it('should handle chained AssignmentStatement with string literal on the right', () => {
      const leftGiven = babelIdentifier('foo');
      const middleGiven = babelIdentifier('bar');
      const rightGiven = babelStringLiteral('baz');
      const given = babelAssignmentExpression(
        '+=',
        leftGiven,
        babelAssignmentExpression('+=', middleGiven, rightGiven)
      );

      const expected = nodeGroup([
        assignmentStatement(
          AssignmentStatementOperatorEnum.CONCAT,
          [
            stringInferableExpression(
              mockNodeWithValue(middleGiven)
            ) as LuaIdentifier,
          ],
          [stringInferableExpression(mockNodeWithValue(rightGiven))]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.CONCAT,
          [
            stringInferableExpression(
              mockNodeWithValue(leftGiven)
            ) as LuaIdentifier,
          ],
          [stringInferableExpression(mockNodeWithValue(middleGiven))]
        ),
      ]);

      expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
        expected
      );
    });
  });

  describe('-= operator', () => {
    it('should handle simple AssignmentStatement', () => {
      const leftGiven = babelIdentifier('foo');
      const rightGiven = babelIdentifier('bar');
      const given = babelAssignmentExpression('-=', leftGiven, rightGiven);

      const expected = assignmentStatement(
        AssignmentStatementOperatorEnum.SUB,
        [mockNodeWithValue(leftGiven) as LuaIdentifier],
        [mockNodeWithValue(rightGiven)]
      );

      expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it('should handle chained AssignmentStatement', () => {
      const leftGiven = babelIdentifier('foo');
      const middleGiven = babelIdentifier('bar');
      const rightGiven = babelIdentifier('baz');
      const given = babelAssignmentExpression(
        '-=',
        leftGiven,
        babelAssignmentExpression('-=', middleGiven, rightGiven)
      );

      const expected = nodeGroup([
        assignmentStatement(
          AssignmentStatementOperatorEnum.SUB,
          [mockNodeWithValue(middleGiven) as LuaIdentifier],
          [mockNodeWithValue(rightGiven)]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.SUB,
          [mockNodeWithValue(leftGiven) as LuaIdentifier],
          [mockNodeWithValue(middleGiven)]
        ),
      ]);

      expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
        expected
      );
    });
  });

  describe('*= operator', () => {
    it('should handle simple AssignmentStatement', () => {
      const leftGiven = babelIdentifier('foo');
      const rightGiven = babelIdentifier('bar');
      const given = babelAssignmentExpression('*=', leftGiven, rightGiven);

      const expected = assignmentStatement(
        AssignmentStatementOperatorEnum.MUL,
        [mockNodeWithValue(leftGiven) as LuaIdentifier],
        [mockNodeWithValue(rightGiven)]
      );

      expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it('should handle chained AssignmentStatement', () => {
      const leftGiven = babelIdentifier('foo');
      const middleGiven = babelIdentifier('bar');
      const rightGiven = babelIdentifier('baz');
      const given = babelAssignmentExpression(
        '*=',
        leftGiven,
        babelAssignmentExpression('*=', middleGiven, rightGiven)
      );

      const expected = nodeGroup([
        assignmentStatement(
          AssignmentStatementOperatorEnum.MUL,
          [mockNodeWithValue(middleGiven) as LuaIdentifier],
          [mockNodeWithValue(rightGiven)]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.MUL,
          [mockNodeWithValue(leftGiven) as LuaIdentifier],
          [mockNodeWithValue(middleGiven)]
        ),
      ]);

      expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
        expected
      );
    });
  });

  describe('/= operator', () => {
    it('should handle simple AssignmentStatement', () => {
      const leftGiven = babelIdentifier('foo');
      const rightGiven = babelIdentifier('bar');
      const given = babelAssignmentExpression('/=', leftGiven, rightGiven);

      const expected = assignmentStatement(
        AssignmentStatementOperatorEnum.DIV,
        [mockNodeWithValue(leftGiven) as LuaIdentifier],
        [mockNodeWithValue(rightGiven)]
      );

      expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it('should handle chained AssignmentStatement', () => {
      const leftGiven = babelIdentifier('foo');
      const middleGiven = babelIdentifier('bar');
      const rightGiven = babelIdentifier('baz');
      const given = babelAssignmentExpression(
        '/=',
        leftGiven,
        babelAssignmentExpression('/=', middleGiven, rightGiven)
      );

      const expected = nodeGroup([
        assignmentStatement(
          AssignmentStatementOperatorEnum.DIV,
          [mockNodeWithValue(middleGiven) as LuaIdentifier],
          [mockNodeWithValue(rightGiven)]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.DIV,
          [mockNodeWithValue(leftGiven) as LuaIdentifier],
          [mockNodeWithValue(middleGiven)]
        ),
      ]);

      expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
        expected
      );
    });
  });
});
