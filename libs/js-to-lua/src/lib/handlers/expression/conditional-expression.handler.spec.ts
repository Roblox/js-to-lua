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
  booleanLiteral,
  booleanMethod,
  callExpression,
  elseClause,
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
  logicalExpression,
  LuaExpression,
  LuaLogicalExpressionOperatorEnum,
  returnStatement,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../../testUtils/mock-node';
import { createConditionalExpressionHandler } from './conditional-expression.handler';
import { HandlerFunction } from '../../types';
import { handleExpression } from '../expression-statement.handler';
import { forwardHandlerRef } from '../../utils/forward-handler-ref';

const source = '';

describe('Conditional Expression Handler', () => {
  let handleConditionalExpression: HandlerFunction<LuaExpression, Expression>;

  beforeEach(() => {
    handleConditionalExpression = createConditionalExpressionHandler(
      mockNodeWithValueHandler
    ).handler;
  });

  it(`should handle ConditionalExpression - when consequent expression in unknown`, () => {
    const given = babelConditionalExpression(
      babelIdentifier('a'),
      babelIdentifier('b'),
      babelIdentifier('c')
    );
    const expected = callExpression(
      functionExpression(
        [],
        [
          ifStatement(
            ifClause(
              callExpression(booleanMethod('toJSBoolean'), [
                mockNodeWithValue(babelIdentifier('a')),
              ]),
              [returnStatement(mockNodeWithValue(babelIdentifier('b')))]
            ),
            [],
            elseClause([
              returnStatement(mockNodeWithValue(babelIdentifier('c'))),
            ])
          ),
        ]
      ),
      []
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
        const expected = callExpression(
          functionExpression(
            [],
            [
              ifStatement(
                ifClause(coerced, [returnStatement(identifier('b'))]),
                [],
                elseClause([returnStatement(identifier('c'))])
              ),
            ]
          ),
          []
        );

        const actual = handleConditionalExpression(source, {}, given);
        expect(actual).toEqual(expected);
      });
    });
  });

  const falsyValues = [
    babelBooleanLiteral(false),
    babelNullLiteral(),
    babelIdentifier('undefined'),
  ];

  falsyValues.forEach((consequentGiven) => {
    it(`should handle ConditionalExpression when consequent expression is falsy: ${JSON.stringify(
      consequentGiven
    )}`, () => {
      const given = babelConditionalExpression(
        babelIdentifier('a'),
        consequentGiven,
        babelIdentifier('c')
      );
      const expected = callExpression(
        functionExpression(
          [],
          [
            ifStatement(
              ifClause(
                callExpression(booleanMethod('toJSBoolean'), [
                  mockNodeWithValue(babelIdentifier('a')),
                ]),
                [returnStatement(mockNodeWithValue(consequentGiven))]
              ),
              [],
              elseClause([
                returnStatement(mockNodeWithValue(babelIdentifier('c'))),
              ])
            ),
          ]
        ),
        []
      );

      expect(handleConditionalExpression(source, {}, given)).toEqual(expected);
    });
  });

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

  truthyValues.forEach((consequentGiven) => {
    it(`should handle ConditionalExpression when consequent expression is truthy in Lua: ${JSON.stringify(
      consequentGiven
    )}`, () => {
      const given = babelConditionalExpression(
        babelIdentifier('a'),
        consequentGiven,
        babelIdentifier('c')
      );
      const expected = logicalExpression(
        LuaLogicalExpressionOperatorEnum.OR,
        logicalExpression(
          LuaLogicalExpressionOperatorEnum.AND,
          callExpression(booleanMethod('toJSBoolean'), [
            mockNodeWithValue(babelIdentifier('a')),
          ]),
          mockNodeWithValue(consequentGiven)
        ),
        mockNodeWithValue(babelIdentifier('c'))
      );

      expect(handleConditionalExpression(source, {}, given)).toEqual(expected);
    });
  });
});
