import { LuaMultilineStringLiteral } from '@js-to-lua/lua-types';
import { printMultilineString } from './print-multiline-string';

interface TestCase {
  given: LuaMultilineStringLiteral;
  expected: string;
}

describe('Print Multiline String Literal', () => {
  const testCases: TestCase[] = [
    {
      given: {
        type: 'MultilineStringLiteral',
        value: '\n\nfoo\n[[bar]]\nbaz\n',
      },
      expected: '[=[\n\nfoo\n[[bar]]\nbaz\n]=]',
    },
    {
      given: {
        type: 'MultilineStringLiteral',
        value: 'foo\n[[bar]]\n[=[baz]=]\n[====[fizz]====]\n',
      },
      expected: '[==[foo\n[[bar]]\n[=[baz]=]\n[====[fizz]====]\n]==]',
    },
  ];
  testCases.forEach(({ given, expected }) => {
    it(`should wrap multiline with correct delimiter if other delimiters are within the multiline`, () => {
      expect(printMultilineString(given)).toEqual(expected);
    });
  });
});
