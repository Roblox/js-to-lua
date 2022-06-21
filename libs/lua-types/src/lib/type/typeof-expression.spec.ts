import { identifier } from '../expression';
import {
  isTypeOfExpression,
  LuaTypeOfExpression,
  typeofExpression,
} from './typeof-expression';

describe('TypeOfExpression', () => {
  describe('typeofExpression creator function', () => {
    it('should construct typeofExpression', () => {
      const given = typeofExpression(identifier('foo'));

      const expected: LuaTypeOfExpression = {
        type: 'LuaTypeOfExpression',
        expression: {
          type: 'Identifier',
          name: 'foo',
        },
      };

      expect(given).toEqual(expected);
    });
  });

  describe('check function', () => {
    it('isTypeOfExpression should return true for TypeOfExpression', () => {
      expect(
        isTypeOfExpression({
          type: 'LuaTypeOfExpression',
          expression: {
            type: 'Identifier',
            name: 'foo',
          },
        } as LuaTypeOfExpression)
      ).toBe(true);
    });

    it('isTypeOfExpression should return true for typeofExpression creator function', () => {
      expect(isTypeOfExpression(typeofExpression(identifier('foo')))).toBe(
        true
      );
    });
  });
});
