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
import { testUtils } from '@js-to-lua/handler-utils';
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
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createLogicalExpressionHandler } from './logical-expression.handler';

const { mockNodeWithValueHandler } = testUtils;

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

  describe(`should handle || operator`, () => {
    it('with 2 identifiers', () => {
      const leftGiven = babelIdentifier('foo');
      const rightGiven = babelIdentifier('bar');
      const given = babelLogicalExpression('||', leftGiven, rightGiven);

      const handleLogicalExpression = createLogicalExpressionHandler(
        testUtils.mockNodeWithValueHandler
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
        jest
          .fn()
          .mockImplementationOnce(() =>
            booleanInferableExpression(identifier('foo'))
          )
          .mockImplementationOnce(() =>
            booleanInferableExpression(identifier('bar'))
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
        mockNodeWithValueHandler
      );

      const expected = callExpression(
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

      expect(handleLogicalExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it.each(falsyValues)(`when right side is falsy: %s`, (rightGiven) => {
      const leftGiven = babelIdentifier('foo');
      const given = babelLogicalExpression('&&', leftGiven, rightGiven);

      const handleLogicalExpression = createLogicalExpressionHandler(
        mockNodeWithValueHandler
      );

      const expected = callExpression(
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

      expect(handleLogicalExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it.each(truthyValues)(
      `when right side is truthy in Lua: %s`,
      (rightGiven) => {
        const leftGiven = babelIdentifier('foo');
        const given = babelLogicalExpression('&&', leftGiven, rightGiven);

        const handleLogicalExpression = createLogicalExpressionHandler(
          mockNodeWithValueHandler
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
        jest
          .fn()
          .mockImplementationOnce(() =>
            booleanInferableExpression(identifier('foo'))
          )
          .mockImplementationOnce(() =>
            booleanInferableExpression(identifier('bar'))
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
          mockNodeWithValueHandler
        );

        const expected = ifElseExpression(
          ifExpressionClause(
            binaryExpression(mockNodeWithValue(leftGiven), '~=', nilLiteral()),
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
