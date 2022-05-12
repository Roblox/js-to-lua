import {
  arrayExpression as babelArrayExpression,
  booleanLiteral as babelBooleanLiteral,
  callExpression as babelCallExpression,
  identifier as babelIdentifier,
  logicalExpression as babelLogicalExpression,
  nullLiteral as babelNullLiteral,
  numericLiteral as babelNumericLiteral,
  objectExpression as babelObjectExpression,
  stringLiteral as babelStringLiteral,
} from '@babel/types';
import {
  asStatementReturnTypeInline,
  createAsStatementHandlerFunction,
  testUtils,
} from '@js-to-lua/handler-utils';
import {
  booleanInferableExpression,
  booleanMethod,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  callExpression,
  elseClause,
  elseExpressionClause,
  functionExpression,
  identifier,
  ifClause,
  ifElseExpression,
  ifExpressionClause,
  ifStatement,
  logicalExpression,
  LuaLogicalExpressionOperatorEnum,
  nilLiteral,
  nodeGroup,
  returnStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import {
  createLogicalExpressionAsStatementHandler,
  createLogicalExpressionHandler,
} from './logical-expression.handler';

const { mockNodeAsStatementWithValueHandler } = testUtils;

const source = '';

describe('Logical Expression Handler', () => {
  const falsyValues = [
    babelBooleanLiteral(false),
    babelNullLiteral(),
    babelIdentifier('undefined'),
  ];

  const truthyValues = [
    babelNumericLiteral(0),
    babelNumericLiteral(1),
    babelStringLiteral(''),
    babelStringLiteral('abc'),
    babelBooleanLiteral(true),
    babelObjectExpression([]),
    babelArrayExpression([]),
    babelIdentifier('NaN'),
  ];

  describe('as expression', () => {
    describe(`should handle || operator`, () => {
      it('with 2 identifiers', () => {
        const leftGiven = babelIdentifier('foo');
        const rightGiven = babelIdentifier('bar');
        const given = babelLogicalExpression('||', leftGiven, rightGiven);

        const handleLogicalExpression = createLogicalExpressionHandler(
          mockNodeAsStatementWithValueHandler
        );

        const expected = logicalExpression(
          LuaLogicalExpressionOperatorEnum.OR,
          logicalExpression(
            LuaLogicalExpressionOperatorEnum.AND,
            callExpression(booleanMethod('toJSBoolean'), [
              mockNodeWithValue(leftGiven),
            ]),
            mockNodeWithValue(leftGiven)
          ),
          mockNodeWithValue(rightGiven)
        );

        expect(handleLogicalExpression.handler(source, {}, given)).toEqual(
          expected
        );
      });

      it('with boolean inferable expressions', () => {
        const leftGiven = babelIdentifier('foo');
        const rightGiven = babelIdentifier('bar');
        const given = babelLogicalExpression('||', leftGiven, rightGiven);

        const handleLogicalExpression = createLogicalExpressionHandler(
          createAsStatementHandlerFunction(
            jest
              .fn()
              .mockImplementationOnce(() =>
                asStatementReturnTypeInline(
                  [],
                  booleanInferableExpression(identifier('foo')),
                  []
                )
              )
              .mockImplementationOnce(() =>
                asStatementReturnTypeInline(
                  [],
                  booleanInferableExpression(identifier('bar')),
                  []
                )
              )
          )
        );

        const expected = booleanInferableExpression(
          logicalExpression(
            LuaLogicalExpressionOperatorEnum.OR,
            booleanInferableExpression(identifier('foo')),
            booleanInferableExpression(identifier('bar'))
          )
        );

        expect(handleLogicalExpression.handler(source, {}, given)).toEqual(
          expected
        );
      });
    });

    describe(`should handle && operator`, () => {
      it('when right side is unknown', () => {
        const leftGiven = babelIdentifier('foo');
        const rightGiven = babelIdentifier('bar');
        const given = babelLogicalExpression('&&', leftGiven, rightGiven);

        const handleLogicalExpression = createLogicalExpressionHandler(
          mockNodeAsStatementWithValueHandler
        );

        const expected = ifElseExpression(
          ifExpressionClause(
            callExpression(booleanMethod('toJSBoolean'), [
              mockNodeWithValue(leftGiven),
            ]),
            mockNodeWithValue(rightGiven)
          ),
          elseExpressionClause(mockNodeWithValue(leftGiven))
        );

        expect(handleLogicalExpression.handler(source, {}, given)).toEqual(
          expected
        );
      });

      it.each(falsyValues)(`when right side is falsy: %s`, (rightGiven) => {
        const leftGiven = babelIdentifier('foo');
        const given = babelLogicalExpression('&&', leftGiven, rightGiven);

        const handleLogicalExpression = createLogicalExpressionHandler(
          mockNodeAsStatementWithValueHandler
        );

        const expected = ifElseExpression(
          ifExpressionClause(
            callExpression(booleanMethod('toJSBoolean'), [
              mockNodeWithValue(leftGiven),
            ]),
            mockNodeWithValue(rightGiven)
          ),
          elseExpressionClause(mockNodeWithValue(leftGiven))
        );

        const actual = handleLogicalExpression.handler(source, {}, given);
        expect(JSON.stringify(actual, undefined, 2)).toEqual(
          JSON.stringify(expected, undefined, 2)
        );
      });

      it.each(truthyValues)(
        `when right side is truthy in Lua: %s`,
        (rightGiven) => {
          const leftGiven = babelIdentifier('foo');
          const given = babelLogicalExpression('&&', leftGiven, rightGiven);

          const handleLogicalExpression = createLogicalExpressionHandler(
            mockNodeAsStatementWithValueHandler
          );

          const expected = logicalExpression(
            LuaLogicalExpressionOperatorEnum.OR,
            logicalExpression(
              LuaLogicalExpressionOperatorEnum.AND,
              callExpression(booleanMethod('toJSBoolean'), [
                mockNodeWithValue(leftGiven),
              ]),
              mockNodeWithValue(rightGiven)
            ),
            mockNodeWithValue(leftGiven)
          );

          expect(handleLogicalExpression.handler(source, {}, given)).toEqual(
            expected
          );
        }
      );

      it('with boolean inferable expressions', () => {
        const leftGiven = babelIdentifier('foo');
        const rightGiven = babelIdentifier('bar');
        const given = babelLogicalExpression('&&', leftGiven, rightGiven);

        const handleLogicalExpression = createLogicalExpressionHandler(
          createAsStatementHandlerFunction(
            jest
              .fn()
              .mockImplementationOnce(() =>
                asStatementReturnTypeInline(
                  [],
                  booleanInferableExpression(identifier('foo')),
                  []
                )
              )
              .mockImplementationOnce(() =>
                asStatementReturnTypeInline(
                  [],
                  booleanInferableExpression(identifier('bar')),
                  []
                )
              )
          )
        );

        const expected = booleanInferableExpression(
          logicalExpression(
            LuaLogicalExpressionOperatorEnum.AND,
            booleanInferableExpression(identifier('foo')),
            booleanInferableExpression(identifier('bar'))
          )
        );

        expect(handleLogicalExpression.handler(source, {}, given)).toEqual(
          expected
        );
      });
    });

    describe(`should handle ?? operator`, () => {
      it.each([...truthyValues, ...falsyValues])(
        `when right side is either truthy or falsy: %s`,
        (rightGiven) => {
          const leftGiven = babelIdentifier('foo');
          const given = babelLogicalExpression('??', leftGiven, rightGiven);

          const handleLogicalExpression = createLogicalExpressionHandler(
            mockNodeAsStatementWithValueHandler
          );

          const expected = ifElseExpression(
            ifExpressionClause(
              binaryExpression(
                mockNodeWithValue(leftGiven),
                '~=',
                nilLiteral()
              ),
              mockNodeWithValue(leftGiven)
            ),
            elseExpressionClause(mockNodeWithValue(rightGiven))
          );

          expect(handleLogicalExpression.handler(source, {}, given)).toEqual(
            expected
          );
        }
      );
    });
  });

  describe('as statement', () => {
    const handleExpressionAsStatement = jest.fn();

    const handleLogicalExpressionAsStatement =
      createLogicalExpressionAsStatementHandler(
        createAsStatementHandlerFunction(
          handleExpressionAsStatement.mockImplementation(
            mockNodeAsStatementWithValueHandler
          )
        )
      ).handler;

    beforeEach(() => {
      handleExpressionAsStatement.mockImplementation(
        mockNodeAsStatementWithValueHandler
      );
    });

    describe(`should handle || operator`, () => {
      it('with 2 identifiers', () => {
        const leftGiven = babelIdentifier('foo');
        const rightGiven = babelIdentifier('bar');
        const given = babelLogicalExpression('||', leftGiven, rightGiven);

        const expected = asStatementReturnTypeInline(
          [],
          logicalExpression(
            LuaLogicalExpressionOperatorEnum.OR,
            logicalExpression(
              LuaLogicalExpressionOperatorEnum.AND,
              callExpression(booleanMethod('toJSBoolean'), [
                mockNodeWithValue(leftGiven),
              ]),
              mockNodeWithValue(leftGiven)
            ),
            mockNodeWithValue(rightGiven)
          ),
          []
        );

        expect(handleLogicalExpressionAsStatement(source, {}, given)).toEqual(
          expected
        );
      });

      it('with 2 call expressions', () => {
        const leftGiven = babelCallExpression(babelIdentifier('foo'), []);
        const rightGiven = babelCallExpression(babelIdentifier('bar'), []);
        const given = babelLogicalExpression('||', leftGiven, rightGiven);

        const expected = asStatementReturnTypeInline(
          [
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('ref'))],
              [variableDeclaratorValue(mockNodeWithValue(leftGiven))]
            ),
          ],
          logicalExpression(
            LuaLogicalExpressionOperatorEnum.OR,
            logicalExpression(
              LuaLogicalExpressionOperatorEnum.AND,
              callExpression(booleanMethod('toJSBoolean'), [identifier('ref')]),
              identifier('ref')
            ),
            mockNodeWithValue(rightGiven)
          ),
          []
        );

        expect(handleLogicalExpressionAsStatement(source, {}, given)).toEqual(
          expected
        );
      });

      it('with boolean inferable expressions', () => {
        const leftGiven = babelIdentifier('foo');
        const rightGiven = babelIdentifier('bar');
        const given = babelLogicalExpression('||', leftGiven, rightGiven);

        handleExpressionAsStatement
          .mockImplementationOnce(() =>
            asStatementReturnTypeInline(
              [],
              booleanInferableExpression(identifier('foo')),
              []
            )
          )
          .mockImplementationOnce(() =>
            asStatementReturnTypeInline(
              [],
              booleanInferableExpression(identifier('bar')),
              []
            )
          );
        const expected = asStatementReturnTypeInline(
          [],
          booleanInferableExpression(
            logicalExpression(
              LuaLogicalExpressionOperatorEnum.OR,
              booleanInferableExpression(identifier('foo')),
              booleanInferableExpression(identifier('bar'))
            )
          ),
          []
        );

        expect(handleLogicalExpressionAsStatement(source, {}, given)).toEqual(
          expected
        );
      });
    });

    describe(`should handle && operator`, () => {
      it('when right side is unknown', () => {
        const leftGiven = babelIdentifier('foo');
        const rightGiven = babelIdentifier('bar');
        const given = babelLogicalExpression('&&', leftGiven, rightGiven);

        const expected = asStatementReturnTypeInline(
          [],
          ifElseExpression(
            ifExpressionClause(
              callExpression(booleanMethod('toJSBoolean'), [
                mockNodeWithValue(leftGiven),
              ]),
              mockNodeWithValue(rightGiven)
            ),
            elseExpressionClause(mockNodeWithValue(leftGiven))
          ),
          []
        );

        callExpression(
          functionExpression(
            [],
            nodeGroup([
              ifStatement(
                ifClause(
                  callExpression(booleanMethod('toJSBoolean'), [
                    mockNodeWithValue(leftGiven),
                  ]),
                  nodeGroup([returnStatement(mockNodeWithValue(rightGiven))])
                ),
                [],
                elseClause(
                  nodeGroup([returnStatement(mockNodeWithValue(leftGiven))])
                )
              ),
            ])
          ),
          []
        );

        expect(handleLogicalExpressionAsStatement(source, {}, given)).toEqual(
          expected
        );
      });

      it('when right side is unknown and left is call expression', () => {
        const leftGiven = babelCallExpression(babelIdentifier('foo'), []);
        const rightGiven = babelIdentifier('bar');
        const given = babelLogicalExpression('&&', leftGiven, rightGiven);

        const expected = asStatementReturnTypeInline(
          [
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('ref'))],
              [variableDeclaratorValue(mockNodeWithValue(leftGiven))]
            ),
          ],
          ifElseExpression(
            ifExpressionClause(
              callExpression(booleanMethod('toJSBoolean'), [identifier('ref')]),
              mockNodeWithValue(rightGiven)
            ),
            elseExpressionClause(identifier('ref'))
          ),
          []
        );

        callExpression(
          functionExpression(
            [],
            nodeGroup([
              ifStatement(
                ifClause(
                  callExpression(booleanMethod('toJSBoolean'), [
                    mockNodeWithValue(leftGiven),
                  ]),
                  nodeGroup([returnStatement(mockNodeWithValue(rightGiven))])
                ),
                [],
                elseClause(
                  nodeGroup([returnStatement(mockNodeWithValue(leftGiven))])
                )
              ),
            ])
          ),
          []
        );

        expect(handleLogicalExpressionAsStatement(source, {}, given)).toEqual(
          expected
        );
      });

      it.each(falsyValues)(`when right side is falsy: %s`, (rightGiven) => {
        const leftGiven = babelIdentifier('foo');
        const given = babelLogicalExpression('&&', leftGiven, rightGiven);

        const expected = asStatementReturnTypeInline(
          [],
          ifElseExpression(
            ifExpressionClause(
              callExpression(booleanMethod('toJSBoolean'), [
                mockNodeWithValue(leftGiven),
              ]),
              mockNodeWithValue(rightGiven)
            ),
            elseExpressionClause(mockNodeWithValue(leftGiven))
          ),
          []
        );

        expect(handleLogicalExpressionAsStatement(source, {}, given)).toEqual(
          expected
        );
      });

      it.each(truthyValues)(
        `when right side is truthy in Lua: %s`,
        (rightGiven) => {
          const leftGiven = babelIdentifier('foo');
          const given = babelLogicalExpression('&&', leftGiven, rightGiven);

          const expected = asStatementReturnTypeInline(
            [],
            logicalExpression(
              LuaLogicalExpressionOperatorEnum.OR,
              logicalExpression(
                LuaLogicalExpressionOperatorEnum.AND,
                callExpression(booleanMethod('toJSBoolean'), [
                  mockNodeWithValue(leftGiven),
                ]),
                mockNodeWithValue(rightGiven)
              ),
              mockNodeWithValue(leftGiven)
            ),
            []
          );

          expect(handleLogicalExpressionAsStatement(source, {}, given)).toEqual(
            expected
          );
        }
      );

      it('with boolean inferable expressions', () => {
        const leftGiven = babelIdentifier('foo');
        const rightGiven = babelIdentifier('bar');
        const given = babelLogicalExpression('&&', leftGiven, rightGiven);

        handleExpressionAsStatement
          .mockImplementationOnce(() =>
            asStatementReturnTypeInline(
              [],
              booleanInferableExpression(identifier('foo')),
              []
            )
          )
          .mockImplementationOnce(() =>
            asStatementReturnTypeInline(
              [],
              booleanInferableExpression(identifier('bar')),
              []
            )
          );

        const expected = asStatementReturnTypeInline(
          [],
          booleanInferableExpression(
            logicalExpression(
              LuaLogicalExpressionOperatorEnum.AND,
              booleanInferableExpression(identifier('foo')),
              booleanInferableExpression(identifier('bar'))
            )
          ),
          []
        );

        expect(handleLogicalExpressionAsStatement(source, {}, given)).toEqual(
          expected
        );
      });
    });

    describe(`should handle ?? operator`, () => {
      it('with 2 call expressions', () => {
        const leftGiven = babelCallExpression(babelIdentifier('foo'), []);
        const rightGiven = babelCallExpression(babelIdentifier('bar'), []);
        const given = babelLogicalExpression('??', leftGiven, rightGiven);

        const expected = asStatementReturnTypeInline(
          [
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('ref'))],
              [variableDeclaratorValue(mockNodeWithValue(leftGiven))]
            ),
          ],
          ifElseExpression(
            ifExpressionClause(
              binaryExpression(identifier('ref'), '~=', nilLiteral()),
              identifier('ref')
            ),
            elseExpressionClause(mockNodeWithValue(rightGiven))
          ),
          []
        );

        expect(handleLogicalExpressionAsStatement(source, {}, given)).toEqual(
          expected
        );
      });

      it.each([...truthyValues, ...falsyValues])(
        `when right side is either truthy or falsy: %s`,
        (rightGiven) => {
          const leftGiven = babelIdentifier('foo');
          const given = babelLogicalExpression('??', leftGiven, rightGiven);

          const expected = asStatementReturnTypeInline(
            [],
            ifElseExpression(
              ifExpressionClause(
                binaryExpression(
                  mockNodeWithValue(leftGiven),
                  '~=',
                  nilLiteral()
                ),
                mockNodeWithValue(leftGiven)
              ),
              elseExpressionClause(mockNodeWithValue(rightGiven))
            ),
            []
          );

          expect(handleLogicalExpressionAsStatement(source, {}, given)).toEqual(
            expected
          );
        }
      );
    });
  });
});
