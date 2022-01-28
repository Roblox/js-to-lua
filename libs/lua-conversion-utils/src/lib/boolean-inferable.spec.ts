import {
  BaseLuaNode,
  binaryExpression,
  booleanLiteral,
  callExpression,
  identifier,
  LuaBinaryExpressionOperator,
  LuaExpression,
  memberExpression,
  numericLiteral,
  stringLiteral,
  tableConstructor,
  unaryNegationExpression,
} from '@js-to-lua/lua-types';
import { mockNode } from '@js-to-lua/lua-types/test-utils';
import {
  booleanInferableExpression,
  isBooleanInferable,
} from './boolean-inferable';

describe('Boolean inferable', () => {
  describe('creator function', () => {
    it('should add `isBooleanInferable` extra property', () => {
      const given = mockNode();

      const expected: BaseLuaNode = {
        ...mockNode(),
        extras: {
          isBooleanInferable: true,
        },
      };

      expect(booleanInferableExpression(given)).toEqual(expected);
    });
  });

  describe('check function', () => {
    it('should return true for node with isBooleanInferable extra property set to true', () => {
      const given = { ...mockNode(), extras: { isBooleanInferable: true } };

      expect(isBooleanInferable(given)).toBe(true);
    });

    it('should return false for node with isBooleanInferable extra property set to false', () => {
      const given = { ...mockNode(), extras: { isBooleanInferable: false } };

      expect(isBooleanInferable(given)).toBe(false);
    });

    it.each([0, undefined, null, '', {}, [], 1])(
      'should return false for node with isBooleanInferable extra property set to %s',
      (falsyValue) => {
        const given: LuaExpression = {
          ...mockNode(),
          extras: { isBooleanInferable: falsyValue },
        };

        expect(isBooleanInferable(given)).toBe(false);
      }
    );

    it.each([true, false])(
      'should return true for boolean literal: %s',
      (value) => {
        const given = booleanLiteral(value);

        expect(isBooleanInferable(given)).toBe(true);
      }
    );

    it('should return true for unary negation', () => {
      const given = unaryNegationExpression(identifier('test'));

      expect(isBooleanInferable(given)).toBe(true);
    });

    it.each(
      Array<LuaBinaryExpressionOperator>('==', '~=', '>', '<', '>=', '<=')
    )(
      `should return true for binary expression with operator: '%s'`,
      (operator) => {
        const given = binaryExpression(
          identifier('foo'),
          operator,
          identifier('bar')
        );

        expect(isBooleanInferable(given)).toBe(true);
      }
    );

    it.each(
      Array<LuaBinaryExpressionOperator>('+', '-', '/', '%', '^', '*', '..')
    )(
      `should return false for binary expression with operator: '%s'`,
      (operator) => {
        const given = binaryExpression(
          identifier('foo'),
          operator,
          identifier('bar')
        );

        expect(isBooleanInferable(given)).toBe(false);
      }
    );

    it('should return true for toJSBooleanMethod call', () => {
      const given = callExpression(
        memberExpression(identifier('Boolean'), '.', identifier('toJSBoolean')),
        [identifier('foo')]
      );

      expect(isBooleanInferable(given)).toBe(true);
    });

    it.each(
      Array<LuaExpression>(
        identifier('foo'),
        stringLiteral('boo'),
        numericLiteral(0),
        numericLiteral(1),
        tableConstructor()
      )
    )('should return false for %s', (given) => {
      expect(isBooleanInferable(given)).toBe(false);
    });
  });
});
