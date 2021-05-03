import { NumericLiteral } from '@babel/types';
import { LuaNumericLiteral } from '../../lua-nodes.types';
import { handleNumericLiteral } from './numeric.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

describe('Numeric Handler', () => {
  [1, 2, 5, 10, NaN].forEach((value) => {
    it(`should return Lua Numeric Node with value ${value}`, () => {
      const given: NumericLiteral = {
        ...DEFAULT_NODE,
        type: 'NumericLiteral',
        value,
      };
      const expected: LuaNumericLiteral = {
        type: 'NumericLiteral',
        value,
      };

      expect(handleNumericLiteral.handler(given)).toEqual(expected);
    });
  });

  Object.entries({
    ['Decimal']: ['1', '12', '98', '456'],
    ['Decimal starting with 0']: ['09', '01239', '0191111'],
    ['Hexadecimal']: [
      '0x123',
      '0X123',
      '0xabc',
      '0Xabc',
      '0x123456789abcdef',
      '0X123456789abcdef',
    ],
    ['Binary']: ['0b101', '0B101', '0b00001', '0B00001'],
    ['Float']: ['0.1', '0.001234', '1.123', '.001234', '1234.'],
    ['Float - negative']: ['-0.1', '-0.001234', '-1.123', '-.001234', '-1234.'],
    ['Float - positive']: ['+0.1', '+0.001234', '+1.123', '+.001234', '+1234.'],
    ['Float - scientific']: [
      '0.001234E12',
      '1.123E9',
      '.001234E12',
      '1234.E12',
    ],
    ['Float - scientific - negative']: [
      '0.001234E-12',
      '1.123E-9',
      '.001234E-12',
      '1234.E-12',
    ],
    ['Float - scientific - positive']: [
      '0.001234E+12',
      '1.123E+9',
      '.001234E+12',
      '1234.E+12',
    ],
  }).forEach(([key, values]) => {
    describe(`${key}`, () => {
      values.forEach((_value) => {
        const value = +_value;
        it(`should return Lua Numeric Node with value ${_value} with extras`, () => {
          const given: NumericLiteral = {
            ...DEFAULT_NODE,
            type: 'NumericLiteral',
            value,
            extra: {
              raw: _value,
            },
          };
          const expected: LuaNumericLiteral = {
            type: 'NumericLiteral',
            value,
            extra: {
              raw: _value,
            },
          };

          expect(handleNumericLiteral.handler(given)).toEqual(expected);
        });
      });
    });
  });

  Object.entries({
    ['Octal']: ['0o1', '0O1', '0o12', '0O12', '0o78', '0O78'],
  }).forEach(([key, values]) => {
    describe(`${key}`, () => {
      values.forEach((_value) => {
        const value = +_value;
        it(`should return Lua Numeric Node with value ${_value} without extras`, () => {
          const given: NumericLiteral = {
            ...DEFAULT_NODE,
            type: 'NumericLiteral',
            value,
            extra: {
              raw: _value,
            },
          };
          const expected: LuaNumericLiteral = {
            type: 'NumericLiteral',
            value,
          };

          expect(handleNumericLiteral.handler(given)).toEqual(expected);
        });
      });
    });
  });
});
