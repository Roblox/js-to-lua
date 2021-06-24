import { TemplateLiteral } from '@babel/types';
import { LuaMultilineStringLiteral } from '@js-to-lua/lua-types';
import { handleMultilineStringLiteral } from './multiline-string.handler';

const DEFAULT_NODE = {
  leadingComments: null,
  innerComments: null,
  trailingComments: null,
  start: null,
  end: null,
  loc: null,
};

const source = '';

interface TestCase {
  itLabel: string;
  given: TemplateLiteral;
  expected: LuaMultilineStringLiteral;
}

interface RawTestCase {
  itLabel: string;
  givenValue: string;
  expectedValue: string;
}

describe('Multiline String Handler', () => {
  const rawTestCases: RawTestCase[] = [
    {
      itLabel:
        'should not print an extra line if template literal does not start with a newline',
      givenValue: 'foo\nbar\nbaz\n',
      expectedValue: 'foo\nbar\nbaz\n',
    },
    {
      itLabel:
        'should print an extra line if template literal starts with a newline',
      givenValue: '\nfoo\nbar\nbaz\n',
      expectedValue: '\n\nfoo\nbar\nbaz\n',
    },
  ];
  const testCasesMapFn = (rawTestCase: RawTestCase): TestCase => {
    return {
      itLabel: rawTestCase.itLabel,
      given: {
        ...DEFAULT_NODE,
        type: 'TemplateLiteral',
        expressions: [],
        quasis: [
          {
            ...DEFAULT_NODE,
            type: 'TemplateElement',
            value: {
              raw: rawTestCase.givenValue,
            },
            tail: true,
          },
        ],
      },
      expected: {
        type: 'MultilineStringLiteral',
        value: rawTestCase.expectedValue,
      },
    };
  };
  const testCases = rawTestCases.map(testCasesMapFn);

  testCases.forEach(({ itLabel, given, expected }) => {
    it(itLabel, () => {
      expect(handleMultilineStringLiteral.handler(source, given)).toEqual(
        expected
      );
    });
  });
});
