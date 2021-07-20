import {
  identifier as babelIdentifier,
  numericLiteral as babelNumericLiteral,
  stringLiteral as babelStringLiteral,
  templateElement as babelTemplateElement,
  templateLiteral as babelTemplateLiteral,
  TemplateLiteral,
} from '@babel/types';
import {
  callExpression,
  identifier,
  LuaMultilineStringLiteral,
  memberExpression,
  multilineStringLiteral,
} from '@js-to-lua/lua-types';
import { createMultilineStringLiteralHandler } from './multiline-string.handler';
import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../../testUtils/mock-node';

const handleMultilineStringLiteral = createMultilineStringLiteralHandler(
  mockNodeWithValueHandler
);

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
      given: babelTemplateLiteral(
        [
          babelTemplateElement({
            raw: rawTestCase.givenValue,
          }),
        ],
        []
      ),
      expected: multilineStringLiteral(rawTestCase.expectedValue),
    };
  };
  const testCases = rawTestCases.map(testCasesMapFn);

  testCases.forEach(({ itLabel, given, expected }) => {
    it(itLabel, () => {
      expect(handleMultilineStringLiteral.handler(source, {}, given)).toEqual(
        expected
      );
    });
  });

  it('should handle template literal with expressions', () => {
    const given = babelTemplateLiteral(
      [
        babelTemplateElement({
          raw: 'foo: ',
        }),
        babelTemplateElement({
          raw: '\nbar: ',
        }),
        babelTemplateElement({
          raw: '\nbaz: ',
        }),
        babelTemplateElement({
          raw: '\n',
        }),
      ],
      [
        babelIdentifier('foo'),
        babelStringLiteral('bar'),
        babelNumericLiteral(1),
      ]
    );

    const expected = callExpression(
      memberExpression(
        multilineStringLiteral('foo: %s\nbar: %s\nbaz: %s\n'),
        ':',
        identifier('format')
      ),
      [
        mockNodeWithValue(babelIdentifier('foo')),
        mockNodeWithValue(babelStringLiteral('bar')),
        mockNodeWithValue(babelNumericLiteral(1)),
      ]
    );

    expect(handleMultilineStringLiteral.handler(source, {}, given)).toEqual(
      expected
    );
  });
});
