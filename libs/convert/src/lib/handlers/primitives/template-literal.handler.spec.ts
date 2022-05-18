import {
  Expression,
  identifier as babelIdentifier,
  isStringLiteral,
  numericLiteral as babelNumericLiteral,
  stringLiteral as babelStringLiteral,
  templateElement as babelTemplateElement,
  templateLiteral as babelTemplateLiteral,
  TemplateLiteral,
} from '@babel/types';
import {
  createHandlerFunction,
  EmptyConfig,
  testUtils,
} from '@js-to-lua/handler-utils';

import { stringInferableExpression } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  LuaExpression,
  LuaMultilineStringLiteral,
  memberExpression,
  multilineStringLiteral,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createTemplateLiteralHandler } from './template-literal.handler';

const handleExpressionMock = jest.fn();

const handleMultilineStringLiteral = createTemplateLiteralHandler(
  createHandlerFunction(handleExpressionMock)
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

describe('Template Literal Handler', () => {
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

  beforeEach(() => {
    handleExpressionMock.mockImplementation(
      (
        source: string,
        config: EmptyConfig,
        node: Expression
      ): LuaExpression => {
        if (isStringLiteral(node)) {
          return stringLiteral(node.value);
        }
        return testUtils.mockNodeWithValueHandler(source, config, node);
      }
    );
  });

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

    const expected = stringInferableExpression(
      callExpression(
        memberExpression(
          multilineStringLiteral('foo: %s\nbar: %s\nbaz: %s\n'),
          ':',
          identifier('format')
        ),
        [
          callExpression(identifier('tostring'), [
            mockNodeWithValue(babelIdentifier('foo')),
          ]),
          stringLiteral('bar'),
          callExpression(identifier('tostring'), [
            mockNodeWithValue(babelNumericLiteral(1)),
          ]),
        ]
      )
    );

    expect(handleMultilineStringLiteral.handler(source, {}, given)).toEqual(
      expected
    );
  });
});
