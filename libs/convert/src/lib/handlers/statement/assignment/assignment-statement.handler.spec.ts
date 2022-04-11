import {
  arrayPattern,
  AssignmentExpression,
  assignmentExpression as babelAssignmentExpression,
  Identifier,
  identifier as babelIdentifier,
  isIdentifier as isBabelIdentifier,
  LVal,
  memberExpression as babelMemberExpression,
  objectExpression,
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
import {
  stringInferableExpression,
  tablePackCall,
  tableUnpackCall,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  AssignmentStatement,
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  blockStatement,
  identifier,
  LuaIdentifier,
  LuaNodeGroup,
  memberExpression,
  nodeGroup,
  numericLiteral,
  unhandledStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import {
  mockNodeWithValue,
  withLocation,
} from '@js-to-lua/lua-types/test-utils';
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
      {
        type: 'Identifier',
        handler: createHandlerFunction(
          (source: string, config: EmptyConfig, node: Identifier) =>
            identifier(node.name)
        ),
      },
    ],
    mockNodeWithValueHandler
  ).handler,
  createHandlerFunction((source: string, config: EmptyConfig, node: LVal) =>
    isBabelIdentifier(node)
      ? identifier(node.name)
      : mockNodeWithValueHandler(source, config, node)
  ),
  createHandlerFunction(
    (source: string, config: EmptyConfig, node: Identifier) =>
      identifier(node.name)
  ),
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
        [identifier(leftGiven.name)],
        [identifier(rightGiven.name)]
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
          [identifier(middleGiven.name)],
          [identifier(rightGiven.name)]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier(leftGiven.name)],
          [identifier(middleGiven.name)]
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
          [identifier('foo'), identifier('bar')],
          [
            tableUnpackCall(
              identifier('baz'),
              numericLiteral(1),
              numericLiteral(2)
            ),
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
          [identifier('foo')],
          [
            tableUnpackCall(
              identifier('fizz'),
              numericLiteral(1),
              numericLiteral(1)
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('bar'), identifier('baz')],
          [
            tableUnpackCall(
              tableUnpackCall(
                identifier('fizz'),
                numericLiteral(2),
                numericLiteral(2)
              ),
              numericLiteral(1),
              numericLiteral(2)
            ),
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
          [identifier('foo')],
          [
            tableUnpackCall(
              identifier('baz'),
              numericLiteral(1),
              numericLiteral(1)
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('bar')],
          [tablePackCall(tableUnpackCall(identifier('baz'), numericLiteral(2)))]
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
          memberExpression(identifier('baz'), '.', identifier('foo')),
          memberExpression(identifier('baz'), '.', identifier('bar')),
        ]
      );

      expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle object destructuring with object expression on the right`, () => {
      const given = babelAssignmentExpression(
        '=',
        objectPattern([
          objectProperty(babelIdentifier('foo'), babelIdentifier('foo')),
          objectProperty(babelIdentifier('bar'), babelIdentifier('bar')),
        ]),
        objectExpression([
          objectProperty(babelIdentifier('foo'), babelStringLiteral('foo')),
          objectProperty(babelIdentifier('bar'), babelStringLiteral('bar')),
        ])
      );

      const expected = blockStatement([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('ref'))],
          [
            variableDeclaratorValue(
              mockNodeWithValue(
                objectExpression([
                  objectProperty(
                    babelIdentifier('foo'),
                    babelStringLiteral('foo')
                  ),
                  objectProperty(
                    babelIdentifier('bar'),
                    babelStringLiteral('bar')
                  ),
                ])
              )
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo'), identifier('bar')],
          [
            memberExpression(identifier('ref'), '.', identifier('foo')),
            memberExpression(identifier('ref'), '.', identifier('bar')),
          ]
        ),
      ]);

      expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should handle object destructuring with member expression on the right`, () => {
      const given = babelAssignmentExpression(
        '=',
        objectPattern([
          objectProperty(babelIdentifier('foo'), babelIdentifier('foo')),
          objectProperty(babelIdentifier('bar'), babelIdentifier('bar')),
        ]),
        babelMemberExpression(babelIdentifier('obj'), babelIdentifier('prop'))
      );

      const expected = blockStatement([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('ref'))],
          [
            variableDeclaratorValue(
              mockNodeWithValue(
                babelMemberExpression(
                  babelIdentifier('obj'),
                  babelIdentifier('prop')
                )
              )
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo'), identifier('bar')],
          [
            memberExpression(identifier('ref'), '.', identifier('foo')),
            memberExpression(identifier('ref'), '.', identifier('bar')),
          ]
        ),
      ]);

      expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it(`should NOT YET handle assignment expression with object pattern with nested array pattern as left value`, () => {
      const source = 'function({foo, bar: [baz]} = val) {}';

      const given = withLocation({
        start: 9,
        end: 32,
      })(
        babelAssignmentExpression(
          '=',
          objectPattern([
            objectProperty(babelIdentifier('foo'), babelIdentifier('foo')),
            objectProperty(
              babelIdentifier('bar'),
              arrayPattern([babelIdentifier('bar')])
            ),
          ]),
          babelIdentifier('val')
        )
      );

      const expected = withTrailingConversionComment(
        unhandledStatement(),
        'ROBLOX TODO: Unhandled AssignmentStatement when one of the object properties is not supported',
        '{foo, bar: [baz]} = val'
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
          memberExpression(identifier('baz'), '.', identifier('foo')),
          memberExpression(identifier('baz'), '.', identifier('bar')),
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
            memberExpression(identifier('fizz'), '.', identifier('foo')),
            '.',
            identifier('bar')
          ),
          memberExpression(
            memberExpression(identifier('fizz'), '.', identifier('foo')),
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
        [identifier(leftGiven.name)],
        [identifier(rightGiven.name)]
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
            identifier(leftGiven.name)
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
          [identifier(middleGiven.name)],
          [identifier(rightGiven.name)]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.ADD,
          [identifier(leftGiven.name)],
          [identifier(middleGiven.name)]
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
              identifier(middleGiven.name)
            ) as LuaIdentifier,
          ],
          [stringInferableExpression(mockNodeWithValue(rightGiven))]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.CONCAT,
          [
            stringInferableExpression(
              identifier(leftGiven.name)
            ) as LuaIdentifier,
          ],
          [stringInferableExpression(identifier(middleGiven.name))]
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
        [identifier(leftGiven.name)],
        [identifier(rightGiven.name)]
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
          [identifier(middleGiven.name)],
          [identifier(rightGiven.name)]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.SUB,
          [identifier(leftGiven.name)],
          [identifier(middleGiven.name)]
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
        [identifier(leftGiven.name)],
        [identifier(rightGiven.name)]
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
          [identifier(middleGiven.name)],
          [identifier(rightGiven.name)]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.MUL,
          [identifier(leftGiven.name)],
          [identifier(middleGiven.name)]
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
        [identifier(leftGiven.name)],
        [identifier(rightGiven.name)]
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
          [identifier(middleGiven.name)],
          [identifier(rightGiven.name)]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.DIV,
          [identifier(leftGiven.name)],
          [identifier(middleGiven.name)]
        ),
      ]);

      expect(handleAssignmentStatement.handler(source, {}, given)).toEqual(
        expected
      );
    });
  });
});
