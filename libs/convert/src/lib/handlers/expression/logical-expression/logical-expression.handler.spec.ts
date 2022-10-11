import * as Babel from '@babel/types';
import {
  asStatementReturnTypeInline,
  asStatementReturnTypeStandaloneOrInline,
  createAsStatementHandlerFunction,
  testUtils,
} from '@js-to-lua/handler-utils';
import {
  booleanInferableExpression,
  booleanMethod,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  callExpression,
  elseExpressionClause,
  identifier,
  ifClause,
  ifElseExpression,
  ifExpressionClause,
  ifStatement,
  logicalExpression,
  LuaLogicalExpressionOperatorEnum,
  LuaStatement,
  nilLiteral,
  nodeGroup,
  unaryNegationExpression,
  unhandledStatement,
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
    Babel.booleanLiteral(false),
    Babel.nullLiteral(),
    Babel.identifier('undefined'),
  ];

  const truthyValues = [
    Babel.numericLiteral(0),
    Babel.numericLiteral(1),
    Babel.stringLiteral(''),
    Babel.stringLiteral('abc'),
    Babel.booleanLiteral(true),
    Babel.objectExpression([]),
    Babel.arrayExpression([]),
    Babel.identifier('NaN'),
  ];

  describe('as expression', () => {
    describe(`should handle || operator`, () => {
      it('with 2 identifiers', () => {
        const leftGiven = Babel.identifier('foo');
        const rightGiven = Babel.identifier('bar');
        const given = Babel.logicalExpression('||', leftGiven, rightGiven);

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
        const leftGiven = Babel.identifier('foo');
        const rightGiven = Babel.identifier('bar');
        const given = Babel.logicalExpression('||', leftGiven, rightGiven);

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
        const leftGiven = Babel.identifier('foo');
        const rightGiven = Babel.identifier('bar');
        const given = Babel.logicalExpression('&&', leftGiven, rightGiven);

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
        const leftGiven = Babel.identifier('foo');
        const given = Babel.logicalExpression('&&', leftGiven, rightGiven);

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
        expect(actual).toEqual(expected);
      });

      it.each(truthyValues)(
        `when right side is truthy in Lua: %s`,
        (rightGiven) => {
          const leftGiven = Babel.identifier('foo');
          const given = Babel.logicalExpression('&&', leftGiven, rightGiven);

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
        }
      );

      it('with boolean inferable expressions', () => {
        const leftGiven = Babel.identifier('foo');
        const rightGiven = Babel.identifier('bar');
        const given = Babel.logicalExpression('&&', leftGiven, rightGiven);

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
          const leftGiven = Babel.identifier('foo');
          const given = Babel.logicalExpression('??', leftGiven, rightGiven);

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
        const leftGiven = Babel.identifier('foo');
        const rightGiven = Babel.identifier('bar');
        const given = Babel.logicalExpression('||', leftGiven, rightGiven);

        const expected = asStatementReturnTypeStandaloneOrInline(
          [],
          [],
          ifStatement(
            ifClause(
              unaryNegationExpression(
                callExpression(booleanMethod('toJSBoolean'), [
                  mockNodeWithValue(leftGiven),
                ])
              ),
              nodeGroup([
                withTrailingConversionComment(
                  unhandledStatement(),
                  "ROBLOX TODO: Lua doesn't support 'MockNode' as a standalone type"
                ),
              ])
            )
          ),
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
          )
        );

        expect(handleLogicalExpressionAsStatement(source, {}, given)).toEqual(
          expected
        );
      });

      it('with 2 call expressions', () => {
        const leftGiven = Babel.callExpression(Babel.identifier('foo'), []);
        const rightGiven = Babel.callExpression(Babel.identifier('bar'), []);
        const given = Babel.logicalExpression('||', leftGiven, rightGiven);

        const expected = asStatementReturnTypeStandaloneOrInline<LuaStatement>(
          [
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('ref'))],
              [variableDeclaratorValue(mockNodeWithValue(leftGiven))]
            ),
          ],
          [],
          ifStatement(
            ifClause(
              unaryNegationExpression(
                callExpression(booleanMethod('toJSBoolean'), [
                  identifier('ref'),
                ])
              ),
              nodeGroup([
                withTrailingConversionComment(
                  unhandledStatement(),
                  "ROBLOX TODO: Lua doesn't support 'MockNode' as a standalone type"
                ),
              ])
            )
          ),
          logicalExpression(
            LuaLogicalExpressionOperatorEnum.OR,
            logicalExpression(
              LuaLogicalExpressionOperatorEnum.AND,
              callExpression(booleanMethod('toJSBoolean'), [identifier('ref')]),
              identifier('ref')
            ),
            mockNodeWithValue(rightGiven)
          )
        );

        expect(handleLogicalExpressionAsStatement(source, {}, given)).toEqual(
          expected
        );
      });

      it('with boolean inferable expressions', () => {
        const leftGiven = Babel.identifier('foo');
        const rightGiven = Babel.identifier('bar');
        const given = Babel.logicalExpression('||', leftGiven, rightGiven);

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
        const expected = asStatementReturnTypeStandaloneOrInline(
          [],
          [],
          ifStatement(
            ifClause(
              unaryNegationExpression(
                booleanInferableExpression(identifier('foo'))
              ),
              nodeGroup([
                withTrailingConversionComment(
                  unhandledStatement(),
                  "ROBLOX TODO: Lua doesn't support 'Identifier' as a standalone type"
                ),
              ])
            )
          ),
          booleanInferableExpression(
            logicalExpression(
              LuaLogicalExpressionOperatorEnum.OR,
              booleanInferableExpression(identifier('foo')),
              booleanInferableExpression(identifier('bar'))
            )
          )
        );

        expect(handleLogicalExpressionAsStatement(source, {}, given)).toEqual(
          expected
        );
      });
    });

    describe(`should handle && operator`, () => {
      it('when right side is unknown', () => {
        const leftGiven = Babel.identifier('foo');
        const rightGiven = Babel.identifier('bar');

        const given = Babel.logicalExpression('&&', leftGiven, rightGiven);

        const expected = asStatementReturnTypeStandaloneOrInline(
          [],
          [],
          ifStatement(
            ifClause(
              callExpression(booleanMethod('toJSBoolean'), [
                mockNodeWithValue(leftGiven),
              ]),
              nodeGroup([
                withTrailingConversionComment(
                  unhandledStatement(),
                  "ROBLOX TODO: Lua doesn't support 'MockNode' as a standalone type"
                ),
              ])
            )
          ),
          ifElseExpression(
            ifExpressionClause(
              callExpression(booleanMethod('toJSBoolean'), [
                mockNodeWithValue(leftGiven),
              ]),
              mockNodeWithValue(rightGiven)
            ),
            elseExpressionClause(mockNodeWithValue(leftGiven))
          )
        );

        const actual = handleLogicalExpressionAsStatement(source, {}, given);
        expect(actual).toEqual(expected);
      });

      it('when right side is unknown and left is call expression', () => {
        const leftGiven = Babel.callExpression(Babel.identifier('foo'), []);
        const rightGiven = Babel.identifier('bar');
        const given = Babel.logicalExpression('&&', leftGiven, rightGiven);

        const expected = asStatementReturnTypeStandaloneOrInline<LuaStatement>(
          [
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('ref'))],
              [variableDeclaratorValue(mockNodeWithValue(leftGiven))]
            ),
          ],
          [],
          ifStatement(
            ifClause(
              callExpression(booleanMethod('toJSBoolean'), [identifier('ref')]),
              nodeGroup([
                withTrailingConversionComment(
                  unhandledStatement(),
                  "ROBLOX TODO: Lua doesn't support 'MockNode' as a standalone type"
                ),
              ])
            )
          ),
          ifElseExpression(
            ifExpressionClause(
              callExpression(booleanMethod('toJSBoolean'), [identifier('ref')]),
              mockNodeWithValue(rightGiven)
            ),
            elseExpressionClause(identifier('ref'))
          )
        );

        const actual = handleLogicalExpressionAsStatement(source, {}, given);
        expect(actual).toEqual(expected);
      });

      it.each(falsyValues)(`when right side is falsy: %s`, (rightGiven) => {
        const leftGiven = Babel.identifier('foo');
        const given = Babel.logicalExpression('&&', leftGiven, rightGiven);

        const expected = asStatementReturnTypeStandaloneOrInline(
          [],
          [],
          ifStatement(
            ifClause(
              callExpression(booleanMethod('toJSBoolean'), [
                mockNodeWithValue(leftGiven),
              ]),
              nodeGroup([
                withTrailingConversionComment(
                  unhandledStatement(),
                  "ROBLOX TODO: Lua doesn't support 'MockNode' as a standalone type"
                ),
              ])
            )
          ),
          ifElseExpression(
            ifExpressionClause(
              callExpression(booleanMethod('toJSBoolean'), [
                mockNodeWithValue(leftGiven),
              ]),
              mockNodeWithValue(rightGiven)
            ),
            elseExpressionClause(mockNodeWithValue(leftGiven))
          )
        );

        expect(handleLogicalExpressionAsStatement(source, {}, given)).toEqual(
          expected
        );
      });

      it.each(truthyValues)(
        `when right side is truthy in Lua: %s`,
        (rightGiven) => {
          const leftGiven = Babel.identifier('foo');
          const given = Babel.logicalExpression('&&', leftGiven, rightGiven);

          const expected = asStatementReturnTypeStandaloneOrInline(
            [],
            [],
            ifStatement(
              ifClause(
                callExpression(booleanMethod('toJSBoolean'), [
                  mockNodeWithValue(leftGiven),
                ]),
                nodeGroup([
                  withTrailingConversionComment(
                    unhandledStatement(),
                    "ROBLOX TODO: Lua doesn't support 'MockNode' as a standalone type"
                  ),
                ])
              )
            ),
            ifElseExpression(
              ifExpressionClause(
                callExpression(booleanMethod('toJSBoolean'), [
                  mockNodeWithValue(leftGiven),
                ]),
                mockNodeWithValue(rightGiven)
              ),
              elseExpressionClause(mockNodeWithValue(leftGiven))
            )
          );

          expect(handleLogicalExpressionAsStatement(source, {}, given)).toEqual(
            expected
          );
        }
      );

      it('with boolean inferable expressions', () => {
        const leftGiven = Babel.identifier('foo');
        const rightGiven = Babel.identifier('bar');
        const given = Babel.logicalExpression('&&', leftGiven, rightGiven);

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

        const expected = asStatementReturnTypeStandaloneOrInline(
          [],
          [],
          ifStatement(
            ifClause(
              booleanInferableExpression(identifier('foo')),
              nodeGroup([
                withTrailingConversionComment(
                  unhandledStatement(),
                  "ROBLOX TODO: Lua doesn't support 'Identifier' as a standalone type"
                ),
              ])
            )
          ),
          booleanInferableExpression(
            logicalExpression(
              LuaLogicalExpressionOperatorEnum.AND,
              booleanInferableExpression(identifier('foo')),
              booleanInferableExpression(identifier('bar'))
            )
          )
        );

        const actual = handleLogicalExpressionAsStatement(source, {}, given);
        expect(actual).toEqual(expected);
      });
    });

    describe(`should handle ?? operator`, () => {
      it('with 2 call expressions', () => {
        const leftGiven = Babel.callExpression(Babel.identifier('foo'), []);
        const rightGiven = Babel.callExpression(Babel.identifier('bar'), []);
        const given = Babel.logicalExpression('??', leftGiven, rightGiven);

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
          const leftGiven = Babel.identifier('foo');
          const given = Babel.logicalExpression('??', leftGiven, rightGiven);

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
