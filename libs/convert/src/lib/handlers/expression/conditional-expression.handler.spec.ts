import {
  arrayExpression as babelArrayExpression,
  booleanLiteral as babelBooleanLiteral,
  conditionalExpression as babelConditionalExpression,
  Expression,
  identifier as babelIdentifier,
  nullLiteral as babelNullLiteral,
  numericLiteral as babelNumericLiteral,
  objectExpression as babelObjectExpression,
  stringLiteral as babelStringLiteral,
  templateElement as babelTemplateElement,
  templateLiteral as babelTemplateLiteral,
} from '@babel/types';
import {
  forwardHandlerRef,
  HandlerFunction,
  testUtils,
} from '@js-to-lua/handler-utils';
import {
  booleanMethod,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  booleanLiteral,
  callExpression,
  elseExpressionClause,
  identifier,
  ifElseExpression,
  ifExpressionClause,
  LuaExpression,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { handleExpression } from '../expression-statement.handler';
import { createConditionalExpressionHandler } from './conditional-expression.handler';

const source = '';

describe('Conditional Expression Handler', () => {
  let handleConditionalExpression: HandlerFunction<LuaExpression, Expression>;

  beforeEach(() => {
    handleConditionalExpression = createConditionalExpressionHandler(
      testUtils.mockNodeWithValueHandler
    ).handler;
  });

  it(`should handle ConditionalExpression - when consequent expression in unknown`, () => {
    const given = babelConditionalExpression(
      babelIdentifier('a'),
      babelIdentifier('b'),
      babelIdentifier('c')
    );

    const expected = ifElseExpression(
      ifExpressionClause(
        callExpression(booleanMethod('toJSBoolean'), [
          mockNodeWithValue(babelIdentifier('a')),
        ]),
        mockNodeWithValue(babelIdentifier('b'))
      ),
      elseExpressionClause(mockNodeWithValue(babelIdentifier('c')))
    );

    expect(handleConditionalExpression(source, {}, given)).toEqual(expected);
  });

  const coercableTestCases = [
    {
      values: [
        babelNumericLiteral(1),
        babelStringLiteral('abc'),
        babelTemplateLiteral([babelTemplateElement({ raw: '\nfoo' })], []),
      ],
      coerced: withTrailingConversionComment(
        booleanLiteral(true),
        `ROBLOX DEVIATION: coerced from \`coercableValue\` to preserve JS behavior`
      ),
    },
    {
      values: [
        babelNullLiteral(),
        babelIdentifier('undefined'),
        babelNumericLiteral(0),
        babelStringLiteral(''),
      ],
      coerced: withTrailingConversionComment(
        booleanLiteral(false),
        `ROBLOX DEVIATION: coerced from \`coercableValue\` to preserve JS behavior`
      ),
    },
    {
      values: [babelBooleanLiteral(true)],
      coerced: booleanLiteral(true),
    },
    {
      values: [babelBooleanLiteral(false)],
      coerced: booleanLiteral(false),
    },
  ];

  coercableTestCases.forEach(({ values, coerced }) => {
    values.forEach((testGiven_) => {
      it(`should handle ConditionalExpression - with test expression coercion: ${JSON.stringify(
        testGiven_
      )}`, () => {
        const source = 'coercableValue';
        const testGiven = {
          ...testGiven_,
          start: 0,
          end: source.length,
        };

        handleConditionalExpression = createConditionalExpressionHandler(
          forwardHandlerRef(() => handleExpression)
        ).handler;

        const given = babelConditionalExpression(
          testGiven,
          babelIdentifier('b'),
          babelIdentifier('c')
        );
        const expected = ifElseExpression(
          ifExpressionClause(coerced, identifier('b')),
          elseExpressionClause(identifier('c'))
        );

        expect(handleConditionalExpression(source, {}, given)).toEqual(
          expected
        );
      });
    });
  });

  const falsyValues = [
    babelBooleanLiteral(false),
    babelNullLiteral(),
    babelIdentifier('undefined'),
  ];

  it.each(falsyValues)(
    `should handle ConditionalExpression when consequent expression is falsy: %s`,
    (consequentGiven) => {
      const given = babelConditionalExpression(
        babelIdentifier('a'),
        consequentGiven,
        babelIdentifier('c')
      );
      const expected = ifElseExpression(
        ifExpressionClause(
          callExpression(booleanMethod('toJSBoolean'), [
            mockNodeWithValue(babelIdentifier('a')),
          ]),
          mockNodeWithValue(consequentGiven)
        ),
        elseExpressionClause(mockNodeWithValue(babelIdentifier('c')))
      );

      expect(handleConditionalExpression(source, {}, given)).toEqual(expected);
    }
  );

  const truthyValues = [
    babelNumericLiteral(0),
    babelNumericLiteral(1),
    babelStringLiteral(''),
    babelStringLiteral('abc'),
    babelBooleanLiteral(true),
    babelObjectExpression([]),
    babelArrayExpression([]),
    babelIdentifier('NaN'),
  ];

  it.each(truthyValues)(
    `should handle ConditionalExpression when consequent expression is truthy in Lua: %s`,
    (consequentGiven) => {
      const given = babelConditionalExpression(
        babelIdentifier('a'),
        consequentGiven,
        babelIdentifier('c')
      );
      const expected = ifElseExpression(
        ifExpressionClause(
          callExpression(booleanMethod('toJSBoolean'), [
            mockNodeWithValue(babelIdentifier('a')),
          ]),
          mockNodeWithValue(consequentGiven)
        ),
        elseExpressionClause(mockNodeWithValue(babelIdentifier('c')))
      );

      expect(handleConditionalExpression(source, {}, given)).toEqual(expected);
    }
  );
});
