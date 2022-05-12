import {
  arrayPattern,
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
  asStatementReturnTypeInline,
  asStatementReturnTypeWithIdentifier,
  BaseNodeAsStatementHandlerSymbol,
  BaseNodeHandlerSymbol,
  combineAsStatementHandlers,
  combineHandlers,
  createAsStatementHandlerFunction,
  createHandlerFunction,
  EmptyConfig,
  testUtils,
} from '@js-to-lua/handler-utils';
import {
  stringInferableExpression,
  tablePackCall,
  tableUnpackCall,
  unhandledIdentifier,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  blockStatement,
  identifier,
  indexExpression,
  LuaStatement,
  memberExpression,
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
import { createAssignmentExpressionAsStatementHandlerFunction } from './assignment-expression-as-statement.handler';

const { mockNodeWithValueHandler, mockNodeAsStatementWithValueHandler } =
  testUtils;

const handleAssignmentExpressionAsStatement =
  createAssignmentExpressionAsStatementHandlerFunction(
    combineHandlers(
      [
        {
          [BaseNodeHandlerSymbol]: true,
          type: 'StringLiteral',
          handler: createHandlerFunction(
            (source: string, config: EmptyConfig, node: StringLiteral) =>
              stringInferableExpression(mockNodeWithValue(node))
          ),
        },
        {
          [BaseNodeHandlerSymbol]: true,
          type: 'Identifier',
          handler: createHandlerFunction(
            (source: string, config: EmptyConfig, node: Identifier) =>
              identifier(node.name)
          ),
        },
      ],
      mockNodeWithValueHandler
    ).handler,
    combineAsStatementHandlers(
      [
        {
          [BaseNodeAsStatementHandlerSymbol]: true,
          type: 'StringLiteral',
          handler: createAsStatementHandlerFunction<
            LuaStatement,
            StringLiteral
          >((source: string, config: EmptyConfig, node) =>
            asStatementReturnTypeInline(
              [],
              stringInferableExpression(mockNodeWithValue(node)),
              []
            )
          ),
        },
        {
          [BaseNodeAsStatementHandlerSymbol]: true,
          type: 'Identifier',
          handler: createAsStatementHandlerFunction<LuaStatement, Identifier>(
            (source: string, config: EmptyConfig, node) =>
              asStatementReturnTypeInline([], identifier(node.name), [])
          ),
        },
      ],
      mockNodeAsStatementWithValueHandler
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

      const expected = asStatementReturnTypeWithIdentifier(
        [
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier(leftGiven.name)],
            [identifier(rightGiven.name)]
          ),
        ],
        [],
        identifier(leftGiven.name)
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
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

      const expected = asStatementReturnTypeWithIdentifier(
        [
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
        ],
        [],
        identifier(leftGiven.name)
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
    });

    it(`should handle array destructuring`, () => {
      const given = babelAssignmentExpression(
        '=',
        arrayPattern([babelIdentifier('foo'), babelIdentifier('bar')]),
        babelIdentifier('baz')
      );

      const expected = asStatementReturnTypeWithIdentifier(
        [
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
        ],
        [],
        identifier('baz')
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
    });

    it(`should handle array destructuring with nested arrays`, () => {
      const given = babelAssignmentExpression(
        '=',
        arrayPattern([
          babelIdentifier('foo'),
          arrayPattern([babelIdentifier('bar'), babelIdentifier('baz')]),
        ]),
        babelIdentifier('fizz')
      );

      const expected = asStatementReturnTypeWithIdentifier(
        [
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('foo')],
            [indexExpression(identifier('fizz'), numericLiteral(1))]
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
        ],
        [],
        identifier('fizz')
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
    });

    it(`should handle array destructuring with rest element`, () => {
      const given = babelAssignmentExpression(
        '=',
        arrayPattern([
          babelIdentifier('foo'),
          restElement(babelIdentifier('bar')),
        ]),
        babelIdentifier('baz')
      );

      const expected = asStatementReturnTypeWithIdentifier(
        [
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('foo')],
            [indexExpression(identifier('baz'), numericLiteral(1))]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('bar')],
            [
              tablePackCall(
                tableUnpackCall(identifier('baz'), numericLiteral(2))
              ),
            ]
          ),
        ],
        [],
        identifier('baz')
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
    });

    it(`should handle object destructuring`, () => {
      const given = babelAssignmentExpression(
        '=',
        objectPattern([
          objectProperty(babelIdentifier('foo'), babelIdentifier('foo')),
          objectProperty(babelIdentifier('bar'), babelIdentifier('bar')),
        ]),
        babelIdentifier('baz')
      );

      const expected = asStatementReturnTypeWithIdentifier(
        [
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('foo'), identifier('bar')],
            [
              memberExpression(identifier('baz'), '.', identifier('foo')),
              memberExpression(identifier('baz'), '.', identifier('bar')),
            ]
          ),
        ],
        [],
        identifier('baz')
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
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

      const expected = asStatementReturnTypeWithIdentifier(
        [
          blockStatement([
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
          ]),
        ],
        [],
        identifier('ref')
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
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

      const expected = asStatementReturnTypeWithIdentifier(
        [
          blockStatement([
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
          ]),
        ],
        [],
        identifier('ref')
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
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

      const expected = asStatementReturnTypeWithIdentifier(
        [
          withTrailingConversionComment(
            unhandledStatement(),
            'ROBLOX TODO: Unhandled AssignmentStatement when one of the object properties is not supported',
            '{foo, bar: [baz]} = val'
          ),
        ],
        [],
        unhandledIdentifier()
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
    });

    it(`should handle object destructuring with aliases`, () => {
      const given = babelAssignmentExpression(
        '=',
        objectPattern([
          objectProperty(babelIdentifier('foo'), babelIdentifier('fun')),
          objectProperty(babelIdentifier('bar'), babelIdentifier('bat')),
        ]),
        babelIdentifier('baz')
      );

      const expected = asStatementReturnTypeWithIdentifier(
        [
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('fun'), identifier('bat')],
            [
              memberExpression(identifier('baz'), '.', identifier('foo')),
              memberExpression(identifier('baz'), '.', identifier('bar')),
            ]
          ),
        ],
        [],
        identifier('baz')
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
    });

    it(`should handle object destructuring with nested object pattern`, () => {
      const given = babelAssignmentExpression(
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

      const expected = asStatementReturnTypeWithIdentifier(
        [
          assignmentStatement(
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
          ),
        ],
        [],
        identifier('fizz')
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
    });
  });

  describe('+= operator', () => {
    it('should handle simple AssignmentStatement', () => {
      const leftGiven = babelIdentifier('foo');
      const rightGiven = babelIdentifier('bar');
      const given = babelAssignmentExpression('+=', leftGiven, rightGiven);

      const expected = asStatementReturnTypeWithIdentifier(
        [
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier(leftGiven.name)],
            [identifier(rightGiven.name)]
          ),
        ],
        [],
        identifier(leftGiven.name)
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
    });

    it('should handle simple AssignmentStatement with string literal on the right', () => {
      const leftGiven = babelIdentifier('foo');
      const rightGiven = babelStringLiteral('bar');
      const given = babelAssignmentExpression('+=', leftGiven, rightGiven);

      const expected = asStatementReturnTypeWithIdentifier(
        [
          assignmentStatement(
            AssignmentStatementOperatorEnum.CONCAT,
            [stringInferableExpression(identifier(leftGiven.name))],
            [stringInferableExpression(mockNodeWithValue(rightGiven))]
          ),
        ],
        [],
        stringInferableExpression(identifier(leftGiven.name))
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
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

      const expected = asStatementReturnTypeWithIdentifier(
        [
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
        ],
        [],
        identifier(leftGiven.name)
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
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

      const expected = asStatementReturnTypeWithIdentifier(
        [
          assignmentStatement(
            AssignmentStatementOperatorEnum.CONCAT,
            [stringInferableExpression(identifier(middleGiven.name))],
            [stringInferableExpression(mockNodeWithValue(rightGiven))]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.CONCAT,
            [stringInferableExpression(identifier(leftGiven.name))],
            [stringInferableExpression(identifier(middleGiven.name))]
          ),
        ],
        [],
        stringInferableExpression(identifier(leftGiven.name))
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
    });
  });

  describe('-= operator', () => {
    it('should handle simple AssignmentStatement', () => {
      const leftGiven = babelIdentifier('foo');
      const rightGiven = babelIdentifier('bar');
      const given = babelAssignmentExpression('-=', leftGiven, rightGiven);

      const expected = asStatementReturnTypeWithIdentifier(
        [
          assignmentStatement(
            AssignmentStatementOperatorEnum.SUB,
            [identifier(leftGiven.name)],
            [identifier(rightGiven.name)]
          ),
        ],
        [],
        identifier(leftGiven.name)
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
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

      const expected = asStatementReturnTypeWithIdentifier(
        [
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
        ],
        [],
        identifier(leftGiven.name)
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
    });
  });

  describe('*= operator', () => {
    it('should handle simple AssignmentStatement', () => {
      const leftGiven = babelIdentifier('foo');
      const rightGiven = babelIdentifier('bar');
      const given = babelAssignmentExpression('*=', leftGiven, rightGiven);

      const expected = asStatementReturnTypeWithIdentifier(
        [
          assignmentStatement(
            AssignmentStatementOperatorEnum.MUL,
            [identifier(leftGiven.name)],
            [identifier(rightGiven.name)]
          ),
        ],
        [],
        identifier(leftGiven.name)
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
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

      const expected = asStatementReturnTypeWithIdentifier(
        [
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
        ],
        [],
        identifier(leftGiven.name)
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
    });
  });

  describe('/= operator', () => {
    it('should handle simple AssignmentStatement', () => {
      const leftGiven = babelIdentifier('foo');
      const rightGiven = babelIdentifier('bar');
      const given = babelAssignmentExpression('/=', leftGiven, rightGiven);

      const expected = asStatementReturnTypeWithIdentifier(
        [
          assignmentStatement(
            AssignmentStatementOperatorEnum.DIV,
            [identifier(leftGiven.name)],
            [identifier(rightGiven.name)]
          ),
        ],
        [],
        identifier(leftGiven.name)
      );
      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
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

      const expected = asStatementReturnTypeWithIdentifier(
        [
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
        ],
        [],
        identifier(leftGiven.name)
      );

      expect(
        handleAssignmentExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
    });
  });
});
