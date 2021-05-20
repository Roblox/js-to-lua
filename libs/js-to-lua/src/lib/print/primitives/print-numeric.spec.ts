import { LuaNumericLiteral } from '../../lua-nodes.types';
import { printNumeric } from './print-numeric';

interface TestCase {
  given: LuaNumericLiteral;
  expected: string;
}

interface PartialTestCase {
  given: Omit<LuaNumericLiteral, 'type'>;
  expected: string;
}

const createTestCases = (cases: PartialTestCase[]): TestCase[] =>
  cases.map(({ given, expected }) => ({
    given: {
      type: 'NumericLiteral',
      ...given,
    },
    expected,
  }));

describe('Print Numeric Literal', () => {
  createTestCases([
    { given: { value: 9 }, expected: '9' },
    { given: { value: 12 }, expected: '12' },
    { given: { value: 987 }, expected: '987' },
  ]).forEach(({ given, expected }, index) => {
    it(`should print numeric literal with no extra field - ${index}`, () => {
      expect(printNumeric(given)).toEqual(expected);
    });
  });

  createTestCases([
    { given: { value: 9, extra: { raw: '09' } }, expected: '09' },
    { given: { value: 12, extra: { raw: '0b1100' } }, expected: '0b1100' },
    { given: { value: 987, extra: { raw: '0x3db' } }, expected: '0x3db' },
  ]).forEach(({ given, expected }, index) => {
    it(`should print numeric literal with extra field - ${index}`, () => {
      expect(printNumeric(given)).toEqual(expected);
    });
  });

  createTestCases([
    {
      given: { value: 123456, extra: { raw: '123_456' } },
      expected: '123_456',
    },
    {
      given: { value: 123456, extra: { raw: '1_2_3_456' } },
      expected: '1_2_3_456',
    },
    {
      given: { value: 1230000000000, extra: { raw: '1_2_3e10' } },
      expected: '1_2_3e10',
    },
    {
      given: { value: 1.23e125, extra: { raw: '1_2_3e1_23' } },
      expected: '1_2_3e1_23',
    },
    {
      given: {
        value: 2147483648,
        extra: { raw: '0b1_00000_000_00000_00000000000_0000000' },
      },
      expected: '0b1_00000_000_00000_00000000000_0000000',
    },
  ]).forEach(({ given, expected }, index) => {
    it(`should print numeric literal with '_' separator still present - ${index}`, () => {
      expect(printNumeric(given)).toEqual(expected);
    });
  });
});
