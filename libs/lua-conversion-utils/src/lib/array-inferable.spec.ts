import {
  BaseLuaNode,
  identifier,
  LuaExpression,
  numericLiteral,
  stringLiteral,
  tableConstructor,
  tableExpressionKeyField,
  tableNameKeyField,
  tableNoKeyField,
} from '@js-to-lua/lua-types';
import { mockNode } from '@js-to-lua/lua-types/test-utils';
import { arrayInferableExpression, isArrayInferable } from './array-inferable';

describe('Array inferable', () => {
  describe('creator function', () => {
    it('should add `isArrayInferable` extra property', () => {
      const given = mockNode();

      const expected: BaseLuaNode = {
        ...mockNode(),
        extras: {
          isArrayInferable: true,
        },
      };

      expect(arrayInferableExpression(given)).toEqual(expected);
    });
  });

  describe('check function', () => {
    it('should return true for node with isArrayInferable extra property set to true', () => {
      const given = { ...mockNode(), extras: { isArrayInferable: true } };

      expect(isArrayInferable(given)).toBe(true);
    });

    it('should return false for node with isArrayInferable extra property set to false', () => {
      const given = { ...mockNode(), extras: { isArrayInferable: false } };

      expect(isArrayInferable(given)).toBe(false);
    });

    it.each([0, undefined, null, '', {}, [], 1])(
      'should return false for node with isArrayInferable extra property set to %s',
      (falsyValue) => {
        const given: LuaExpression = {
          ...mockNode(),
          extras: { isArrayInferable: falsyValue },
        };

        expect(isArrayInferable(given)).toBe(false);
      }
    );

    it('should return true for empty Table constructor', () => {
      const given = tableConstructor();

      expect(isArrayInferable(given)).toBe(true);
    });

    it('should return true for Table constructor with one no key field', () => {
      const given = tableConstructor([tableNoKeyField(identifier('test'))]);

      expect(isArrayInferable(given)).toBe(true);
    });

    it('should return true for Table constructor with multiple no key fields', () => {
      const given = tableConstructor([
        tableNoKeyField(identifier('test0')),
        tableNoKeyField(identifier('test1')),
        tableNoKeyField(identifier('test2')),
        tableNoKeyField(identifier('test3')),
      ]);

      expect(isArrayInferable(given)).toBe(true);
    });

    it('should return false for Table constructor with one named key field', () => {
      const given = tableConstructor([
        tableNameKeyField(identifier('test'), identifier('value')),
      ]);

      expect(isArrayInferable(given)).toBe(false);
    });

    it('should return false for Table constructor with one expression key field', () => {
      const given = tableConstructor([
        tableExpressionKeyField(identifier('test'), identifier('value')),
      ]);

      expect(isArrayInferable(given)).toBe(false);
    });

    it('should return true for Table constructor with multiple no key fields and one named key field', () => {
      const given = tableConstructor([
        tableNoKeyField(identifier('test0')),
        tableNoKeyField(identifier('test1')),
        tableNoKeyField(identifier('test2')),
        tableNoKeyField(identifier('test3')),
        tableNameKeyField(identifier('test'), identifier('value')),
      ]);

      expect(isArrayInferable(given)).toBe(false);
    });

    it('should return true for Table constructor with multiple no key fields and one expression key field', () => {
      const given = tableConstructor([
        tableNoKeyField(identifier('test0')),
        tableNoKeyField(identifier('test1')),
        tableNoKeyField(identifier('test2')),
        tableNoKeyField(identifier('test3')),
        tableExpressionKeyField(identifier('test'), identifier('value')),
      ]);

      expect(isArrayInferable(given)).toBe(false);
    });
    it.each(
      Array<LuaExpression>(
        identifier('foo'),
        stringLiteral('boo'),
        numericLiteral(0),
        numericLiteral(1)
      )
    )('should return false for %s', (given) => {
      expect(isArrayInferable(given)).toBe(false);
    });
  });
});
