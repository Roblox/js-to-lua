import { isExpression } from './expression';
import { identifier } from './identifier';
import {
  elseExpressionClause,
  elseifExpressionClause,
  ifElseExpression,
  ifExpression,
  ifExpressionClause,
  isIfExpression,
  LuaIfExpression,
} from './if-expression';

describe('IfExpression', () => {
  describe('ifExpression creator function', () => {
    it('should construct if expression without elseif clause', () => {
      const given = ifExpression(
        ifExpressionClause(
          identifier('testExpression'),
          identifier('thenExpression')
        ),
        [],
        elseExpressionClause(identifier('elseExpression'))
      );

      const expected: LuaIfExpression = {
        type: 'IfExpression',
        ifClause: {
          type: 'IfExpressionClause',
          condition: identifier('testExpression'),
          body: identifier('thenExpression'),
        },
        elseClause: {
          type: 'ElseExpressionClause',
          body: identifier('elseExpression'),
        },
      };

      expect(given).toEqual(expected);
    });

    it('should construct if expression with elseif clause', () => {
      const given = ifExpression(
        ifExpressionClause(
          identifier('testExpression'),
          identifier('thenExpression')
        ),
        [
          elseifExpressionClause(
            identifier('elseifTestExpression'),
            identifier('elseifExpression')
          ),
        ],
        elseExpressionClause(identifier('elseExpression'))
      );

      const expected: LuaIfExpression = {
        type: 'IfExpression',
        ifClause: {
          type: 'IfExpressionClause',
          condition: identifier('testExpression'),
          body: identifier('thenExpression'),
        },
        elseifClauses: [
          {
            type: 'ElseifExpressionClause',
            condition: identifier('elseifTestExpression'),
            body: identifier('elseifExpression'),
          },
        ],
        elseClause: {
          type: 'ElseExpressionClause',
          body: identifier('elseExpression'),
        },
      };

      expect(given).toEqual(expected);
    });
  });

  describe('ifElseExpression creator function', () => {
    it('should construct if expression without elseif clause', () => {
      const given = ifElseExpression(
        ifExpressionClause(
          identifier('testExpression'),
          identifier('thenExpression')
        ),
        elseExpressionClause(identifier('elseExpression'))
      );

      const expected: LuaIfExpression = {
        type: 'IfExpression',
        ifClause: {
          type: 'IfExpressionClause',
          condition: identifier('testExpression'),
          body: identifier('thenExpression'),
        },
        elseClause: {
          type: 'ElseExpressionClause',
          body: identifier('elseExpression'),
        },
      };

      expect(given).toEqual(expected);
    });
  });

  describe('check function', () => {
    const ifExpressions = [
      ifExpression(
        ifExpressionClause(
          identifier('testExpression'),
          identifier('thenExpression')
        ),
        [],
        elseExpressionClause(identifier('elseExpression'))
      ),
      ifExpression(
        ifExpressionClause(
          identifier('testExpression'),
          identifier('thenExpression')
        ),
        [
          elseifExpressionClause(
            identifier('elseifTestExpression'),
            identifier('elseifExpression')
          ),
        ],
        elseExpressionClause(identifier('elseExpression'))
      ),
      ifElseExpression(
        ifExpressionClause(
          identifier('testExpression'),
          identifier('thenExpression')
        ),
        elseExpressionClause(identifier('elseExpression'))
      ),
    ];

    it.each(ifExpressions)(
      'isIfExpression should return true for IfExpression node: %s',
      (node) => {
        expect(isIfExpression(node)).toBe(true);
      }
    );

    it.each(ifExpressions)(
      'isExpression should return true for IfExpression node: %s',
      (node) => {
        expect(isExpression(node)).toBe(true);
      }
    );
  });
});
