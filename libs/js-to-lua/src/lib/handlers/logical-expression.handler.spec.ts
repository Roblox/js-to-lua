import {
  arrayExpression as babelArrayExpression,
  booleanLiteral as babelBooleanLiteral,
  identifier as babelIdentifier,
  logicalExpression as babelLogicalExpression,
  nullLiteral as babelNullLiteral,
  numericLiteral as babelNumericLiteral,
  objectExpression as babelObjectExpression,
  stringLiteral as babelStringLiteral,
} from '@babel/types';
import {
  booleanMethod,
  callExpression,
  functionExpression,
  ifStatement,
  logicalExpression,
  LuaLogicalExpressionOperatorEnum,
  returnStatement,
} from '@js-to-lua/lua-types';
import { createLogicalExpressionHandler } from './logical-expression.handler';
import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../testUtils/mock-node';

const source = '';

describe('Logical Expression Handler', () => {
  it(`should handle || operator`, () => {
    const leftGiven = babelIdentifier('foo');
    const rightGiven = babelIdentifier('bar');
    const given = babelLogicalExpression('||', leftGiven, rightGiven);

    const handleLogicalExpression = createLogicalExpressionHandler(
      mockNodeWithValueHandler
    );

    const expected = logicalExpression(
      LuaLogicalExpressionOperatorEnum.AND,
      callExpression(booleanMethod('toJSBoolean'), [
        mockNodeWithValue(leftGiven),
      ]),
      logicalExpression(
        LuaLogicalExpressionOperatorEnum.OR,
        mockNodeWithValue(leftGiven),
        mockNodeWithValue(rightGiven)
      )
    );

    expect(handleLogicalExpression.handler(source, given)).toEqual(expected);
  });

  describe(`should handle && operator`, () => {
    it('when right side is unknown', () => {
      const leftGiven = babelIdentifier('foo');
      const rightGiven = babelIdentifier('bar');
      const given = babelLogicalExpression('&&', leftGiven, rightGiven);

      const handleLogicalExpression = createLogicalExpressionHandler(
        mockNodeWithValueHandler
      );

      const expected = callExpression(
        functionExpression(
          [],
          [],
          [
            ifStatement(
              callExpression(booleanMethod('toJSBoolean'), [
                mockNodeWithValue(leftGiven),
              ]),
              [returnStatement(mockNodeWithValue(rightGiven))],
              [returnStatement(mockNodeWithValue(leftGiven))]
            ),
          ]
        ),
        []
      );

      expect(handleLogicalExpression.handler(source, given)).toEqual(expected);
    });

    const falsyValues = [
      babelBooleanLiteral(false),
      babelNullLiteral(),
      babelIdentifier('undefined'),
    ];

    falsyValues.forEach((rightGiven) => {
      it(`when right side is falsy: ${JSON.stringify(rightGiven)}`, () => {
        const leftGiven = babelIdentifier('foo');
        const given = babelLogicalExpression('&&', leftGiven, rightGiven);

        const handleLogicalExpression = createLogicalExpressionHandler(
          mockNodeWithValueHandler
        );

        const expected = callExpression(
          functionExpression(
            [],
            [],
            [
              ifStatement(
                callExpression(booleanMethod('toJSBoolean'), [
                  mockNodeWithValue(leftGiven),
                ]),
                [returnStatement(mockNodeWithValue(rightGiven))],
                [returnStatement(mockNodeWithValue(leftGiven))]
              ),
            ]
          ),
          []
        );

        expect(handleLogicalExpression.handler(source, given)).toEqual(
          expected
        );
      });
    });

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

    truthyValues.forEach((rightGiven) => {
      it(`when right side is truthy in Lua: ${JSON.stringify(
        rightGiven
      )}`, () => {
        const leftGiven = babelIdentifier('foo');
        const given = babelLogicalExpression('&&', leftGiven, rightGiven);

        const handleLogicalExpression = createLogicalExpressionHandler(
          mockNodeWithValueHandler
        );

        const expected = logicalExpression(
          LuaLogicalExpressionOperatorEnum.AND,
          callExpression(booleanMethod('toJSBoolean'), [
            mockNodeWithValue(leftGiven),
          ]),
          logicalExpression(
            LuaLogicalExpressionOperatorEnum.OR,
            mockNodeWithValue(rightGiven),
            mockNodeWithValue(leftGiven)
          )
        );

        expect(handleLogicalExpression.handler(source, given)).toEqual(
          expected
        );
      });
    });
  });
});
