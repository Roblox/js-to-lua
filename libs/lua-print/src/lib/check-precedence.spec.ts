import {
  binaryExpression,
  elseExpressionClause,
  identifier,
  ifElseExpression,
  ifExpressionClause,
  logicalExpression,
  LuaBinaryExpression,
  LuaExpression,
  LuaIfExpression,
  LuaLogicalExpression,
  LuaLogicalExpressionOperatorEnum,
  LuaUnaryExpression,
  LuaUnaryNegationExpression,
  unaryExpression,
  unaryNegationExpression,
} from '@js-to-lua/lua-types';
import { checkPrecedence } from './check-precedence';

type PrecedenceValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
const precedenceExpressionsMap: Record<
  PrecedenceValue,
  Array<
    (
      left: LuaExpression,
      right: LuaExpression
    ) =>
      | LuaBinaryExpression
      | LuaLogicalExpression
      | LuaUnaryExpression
      | LuaUnaryNegationExpression
      | LuaIfExpression
  >
> = {
  1: [(left, right) => binaryExpression(left, '^', right)],
  2: [
    (left) => unaryExpression('-', left),
    (left) => unaryNegationExpression(left),
  ],
  3: [
    (left, right) => binaryExpression(left, '*', right),
    (left, right) => binaryExpression(left, '/', right),
  ],
  4: [
    (left, right) => binaryExpression(left, '+', right),
    (left, right) => binaryExpression(left, '-', right),
  ],
  5: [
    (left, right) => binaryExpression(left, '..', right),
    (left, right) => binaryExpression(left, '<', right),
    (left, right) => binaryExpression(left, '>', right),
    (left, right) => binaryExpression(left, '<=', right),
    (left, right) => binaryExpression(left, '>=', right),
    (left, right) => binaryExpression(left, '~=', right),
    (left, right) => binaryExpression(left, '==', right),
  ],
  6: [
    (left, right) =>
      logicalExpression(LuaLogicalExpressionOperatorEnum.AND, left, right),
  ],
  7: [
    (left, right) =>
      logicalExpression(LuaLogicalExpressionOperatorEnum.OR, left, right),
  ],
  8: [
    (left, right) =>
      ifElseExpression(
        ifExpressionClause(identifier('condition'), left),
        elseExpressionClause(right)
      ),
  ],
};

describe('Check precedence', () => {
  it('should not have precedence error for identifiers', () => {
    const left = identifier('foo');
    const right = identifier('bar');
    const operator = binaryExpression(left, '+', right);

    expect(checkPrecedence(operator)(left)).toBe(false);
    expect(checkPrecedence(operator, 0)(right)).toBe(false);
  });

  const cases = Array<{
    lowerPrecedence: PrecedenceValue;
    higherPrecedence: Array<PrecedenceValue>;
  }>(
    {
      lowerPrecedence: 8,
      higherPrecedence: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      lowerPrecedence: 7,
      higherPrecedence: [1, 2, 3, 4, 5, 6],
    },
    {
      lowerPrecedence: 6,
      higherPrecedence: [1, 2, 3, 4, 5],
    },
    {
      lowerPrecedence: 5,
      higherPrecedence: [1, 2, 3, 4],
    },
    {
      lowerPrecedence: 4,
      higherPrecedence: [1, 2, 3],
    },
    {
      lowerPrecedence: 3,
      higherPrecedence: [1, 2],
    },
    {
      lowerPrecedence: 2,
      higherPrecedence: [1],
    }
  )
    .map(({ lowerPrecedence, higherPrecedence }) =>
      higherPrecedence.map((operand) =>
        precedenceExpressionsMap[lowerPrecedence].map((lowerPrecedenceFn) =>
          precedenceExpressionsMap[operand].map((higherPrecedenceFn) => ({
            lowerPrecedenceFn,
            higherPrecedenceFn,
          }))
        )
      )
    )
    .flat(3);

  const testIds = {
    a: identifier('a'),
    b: identifier('b'),
    c: identifier('c'),
  };

  it.each(cases)(
    'should not have precedence error when left precedence is higher than right $#',
    ({ lowerPrecedenceFn, higherPrecedenceFn }) => {
      // (a <opHigher> b) <opLower> c
      const { a, b, c } = testIds;
      const left = higherPrecedenceFn(a, b);
      const operator = lowerPrecedenceFn(left, c);
      expect(checkPrecedence(operator)(left)).toBe(false);
    }
  );

  it.each(cases)(
    'should have precedence error when right precedence is lower than left $#',
    ({ lowerPrecedenceFn, higherPrecedenceFn }) => {
      // a <opHigher> (b <opLower> c)
      const { a, b, c } = testIds;
      const right = lowerPrecedenceFn(b, c);
      const operator = higherPrecedenceFn(a, right);
      expect(checkPrecedence(operator, 0)(right)).toBe(true);
    }
  );

  it.each(cases)(
    'should not have precedence error when left precedence is lower than right $#',
    ({ lowerPrecedenceFn, higherPrecedenceFn }) => {
      // a <opLower> (b <opHigher> c)
      const { a, b, c } = testIds;
      const right = higherPrecedenceFn(b, c);
      const operator = lowerPrecedenceFn(a, right);
      expect(checkPrecedence(operator, 0)(right)).toBe(false);
    }
  );

  it.each(cases)(
    'should have precedence error when left precedence is lower than right $#',
    ({ lowerPrecedenceFn, higherPrecedenceFn }) => {
      // (a <opLower> b) <opHigher> c
      const { a, b, c } = testIds;
      const left = lowerPrecedenceFn(a, b);
      const operator = higherPrecedenceFn(left, c);
      expect(checkPrecedence(operator)(left)).toBe(true);
    }
  );

  it.each(cases)(
    'should have precedence error when right precedence is equal to left $#',
    ({ lowerPrecedenceFn }) => {
      // a <opLower> (b <opLower> c)
      const { a, b, c } = testIds;
      const right = lowerPrecedenceFn(b, c);
      const operator = lowerPrecedenceFn(a, right);
      expect(checkPrecedence(operator, 0)(right)).toBe(true);
    }
  );
});
