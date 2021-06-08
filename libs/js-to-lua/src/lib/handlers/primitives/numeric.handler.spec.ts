import { NumericLiteral } from '@babel/types';
import { LuaNumericLiteral } from '@js-to-lua/lua-types';
import { handleNumericLiteral } from './numeric.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

const source = '';

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

      expect(handleNumericLiteral.handler(source, given)).toEqual(expected);
    });
  });

  Object.entries({
    ['Decimal']: ['1', '12', '98', '456', '123_789'],
    ['Decimal starting with 0']: ['09', '01239', '02_372_9_7', '0191111'],
    ['Hexadecimal']: [
      '0x123',
      '0X1_2_3',
      '0xabc',
      '0Xa1_23_f_526_c',
      '0XF78_12_3F8_c',
      '0x123456789abcdef',
      '0x1b_cd_ef',
      '0X123456789abcdef',
    ],
    ['Binary']: [
      '0b101',
      '0B101',
      '0b00001',
      '0B00001',
      '0B00_001',
      '0B00_000_100_0_01',
      '0B0_00_10_0_01',
    ],
    ['Float']: [
      '0.1',
      '0.001234',
      '0.22_325_8',
      '1.123',
      '.001234',
      '.0033_28_9',
      '.0_01_23_4',
      '1234.',
    ],
    ['Float - negative']: [
      '-0.1',
      '-0.001234',
      '-0.0012_3_4',
      '-0.0_04_56_7',
      '-1.123',
      '-.001234',
      '-1234.',
    ],
    ['Float - positive']: [
      '+0.1',
      '+0.001234',
      '+0.002390_1_4',
      '+0.00_88_3_84',
      '+1.123',
      '+.001234',
      '+1234.',
      '+1_2_34.',
      '+1_3_554.56_6_6',
    ],
    ['Float - scientific']: [
      '0.001234E12',
      '0.0034_53_4E2_2',
      '1.123E9',
      '1.3_45E9',
      '.001234E12',
      '.012_8_77E12',
      '1234.E12',
      '22_42.E3_2',
    ],
    ['Float - scientific - negative']: [
      '0.001234E-12',
      '1.123E-9',
      '.001234E-12',
      '.001_23_4E-12',
      '1234.E-12',
      '12_3_4.E-1_2',
      '1_2_3_4.E-1_234',
    ],
    ['Float - scientific - positive']: [
      '0.001234E+12',
      '1.123E+9',
      '1.12_3E+9',
      '.001234E+12',
      '.001_23_4E+1_2',
      '1234.E+12',
      '1_34.E+12',
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

          expect(handleNumericLiteral.handler(source, given)).toEqual(expected);
        });
      });
    });
  });

  Object.entries({
    ['Octal']: ['0o1', '0O1', '0o12', '0O12', '0o67', '0O5_4_7'],
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

          expect(handleNumericLiteral.handler(source, given)).toEqual(expected);
        });
      });
    });
  });
});
