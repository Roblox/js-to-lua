import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  booleanLiteral,
  callExpression,
  elseExpressionClause,
  identifier,
  ifElseExpression,
  ifExpressionClause,
  memberExpression,
  nilLiteral,
  numericLiteral,
  stringLiteral,
  tableConstructor,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

describe('Program handler', () => {
  describe('Conditional Expression Handler', () => {
    it(`should handle ConditionalExpression - when consequent expression in unknown`, () => {
      const source = `
        let foo = a ? b : c
      `;
      const given = getProgramNode(source);
      const expected = programWithUpstreamComment([
        withTrailingConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('LuauPolyfill'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  identifier('Packages'),
                  '.',
                  identifier('LuauPolyfill')
                ),
              ])
            ),
          ]
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('Boolean'))],
          [
            variableDeclaratorValue(
              memberExpression(
                identifier('LuauPolyfill'),
                '.',
                identifier('Boolean')
              )
            ),
          ]
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              ifElseExpression(
                ifExpressionClause(
                  callExpression(
                    memberExpression(
                      identifier('Boolean'),
                      '.',
                      identifier('toJSBoolean')
                    ),
                    [identifier('a')]
                  ),
                  identifier('b')
                ),
                elseExpressionClause(identifier('c'))
              )
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    const coercableTestCases = [
      {
        values: ['1', "'abc'", '`\nfoo`'],
        coerced: (value: string) =>
          withTrailingConversionComment(
            booleanLiteral(true),
            `ROBLOX DEVIATION: coerced from \`${value}\` to preserve JS behavior`
          ),
      },
      {
        values: ['null', 'undefined', '0', "''"],
        coerced: (value: string) =>
          withTrailingConversionComment(
            booleanLiteral(false),
            `ROBLOX DEVIATION: coerced from \`${value}\` to preserve JS behavior`
          ),
      },
      {
        values: ['true'],
        coerced: () => booleanLiteral(true),
      },
      {
        values: ['false'],
        coerced: () => booleanLiteral(false),
      },
    ];

    describe.each(coercableTestCases)('', ({ values, coerced }) => {
      it.each(values)(
        `should handle ConditionalExpression - with test expression coercion: %s`,
        (testGiven) => {
          const source = `
            let foo = ${testGiven} ? b : c
          `;
          const given = getProgramNode(source);
          const expected = programWithUpstreamComment([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('foo'))],
              [
                variableDeclaratorValue(
                  ifElseExpression(
                    ifExpressionClause(coerced(testGiven), identifier('b')),
                    elseExpressionClause(identifier('c'))
                  )
                ),
              ]
            ),
          ]);

          expect(convertProgram(source, {}, given)).toEqual(expected);
        }
      );
    });

    it(`should handle ConditionalExpression when consequent expression is falsy`, () => {
      const source = `
        let foo0 = a ? false : c,
            foo1 = a ? null : c,
            foo2 = a ? undefined : c
      `;
      const given = getProgramNode(source);
      const expected = programWithUpstreamComment([
        withTrailingConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('LuauPolyfill'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  identifier('Packages'),
                  '.',
                  identifier('LuauPolyfill')
                ),
              ])
            ),
          ]
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('Boolean'))],
          [
            variableDeclaratorValue(
              memberExpression(
                identifier('LuauPolyfill'),
                '.',
                identifier('Boolean')
              )
            ),
          ]
        ),
        variableDeclaration(
          [
            variableDeclaratorIdentifier(identifier('foo0')),
            variableDeclaratorIdentifier(identifier('foo1')),
            variableDeclaratorIdentifier(identifier('foo2')),
          ],
          [
            variableDeclaratorValue(
              ifElseExpression(
                ifExpressionClause(
                  callExpression(
                    memberExpression(
                      identifier('Boolean'),
                      '.',
                      identifier('toJSBoolean')
                    ),
                    [identifier('a')]
                  ),
                  booleanLiteral(false)
                ),
                elseExpressionClause(identifier('c'))
              )
            ),
            variableDeclaratorValue(
              ifElseExpression(
                ifExpressionClause(
                  callExpression(
                    memberExpression(
                      identifier('Boolean'),
                      '.',
                      identifier('toJSBoolean')
                    ),
                    [identifier('a')]
                  ),
                  nilLiteral()
                ),
                elseExpressionClause(identifier('c'))
              )
            ),
            variableDeclaratorValue(
              ifElseExpression(
                ifExpressionClause(
                  callExpression(
                    memberExpression(
                      identifier('Boolean'),
                      '.',
                      identifier('toJSBoolean')
                    ),
                    [identifier('a')]
                  ),
                  nilLiteral()
                ),
                elseExpressionClause(identifier('c'))
              )
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should handle ConditionalExpression when consequent expression is truthy in Lua`, () => {
      const source = `
        let foo0 = a ? 0 : c,
            foo1 = a ? 1 : c,
            foo2 = a ? '' : c,
            foo3 = a ? 'abc' : c,
            foo4 = a ? true : c,
            foo5 = a ? [] : c,
            foo6 = a ? {} : c,
            foo7 = a ? NaN : c
      `;
      const given = getProgramNode(source);
      const expected = programWithUpstreamComment([
        withTrailingConversionComment(
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Packages'))],
            []
          ),
          'ROBLOX comment: must define Packages module'
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('LuauPolyfill'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('require'), [
                memberExpression(
                  identifier('Packages'),
                  '.',
                  identifier('LuauPolyfill')
                ),
              ])
            ),
          ]
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('Boolean'))],
          [
            variableDeclaratorValue(
              memberExpression(
                identifier('LuauPolyfill'),
                '.',
                identifier('Boolean')
              )
            ),
          ]
        ),
        variableDeclaration(
          [
            variableDeclaratorIdentifier(identifier('foo0')),
            variableDeclaratorIdentifier(identifier('foo1')),
            variableDeclaratorIdentifier(identifier('foo2')),
            variableDeclaratorIdentifier(identifier('foo3')),
            variableDeclaratorIdentifier(identifier('foo4')),
            variableDeclaratorIdentifier(identifier('foo5')),
            variableDeclaratorIdentifier(identifier('foo6')),
            variableDeclaratorIdentifier(identifier('foo7')),
          ],
          [
            variableDeclaratorValue(
              ifElseExpression(
                ifExpressionClause(
                  callExpression(
                    memberExpression(
                      identifier('Boolean'),
                      '.',
                      identifier('toJSBoolean')
                    ),
                    [identifier('a')]
                  ),
                  numericLiteral(0, '0')
                ),
                elseExpressionClause(identifier('c'))
              )
            ),
            variableDeclaratorValue(
              ifElseExpression(
                ifExpressionClause(
                  callExpression(
                    memberExpression(
                      identifier('Boolean'),
                      '.',
                      identifier('toJSBoolean')
                    ),
                    [identifier('a')]
                  ),
                  numericLiteral(1, '1')
                ),
                elseExpressionClause(identifier('c'))
              )
            ),
            variableDeclaratorValue(
              ifElseExpression(
                ifExpressionClause(
                  callExpression(
                    memberExpression(
                      identifier('Boolean'),
                      '.',
                      identifier('toJSBoolean')
                    ),
                    [identifier('a')]
                  ),
                  stringLiteral('')
                ),
                elseExpressionClause(identifier('c'))
              )
            ),
            variableDeclaratorValue(
              ifElseExpression(
                ifExpressionClause(
                  callExpression(
                    memberExpression(
                      identifier('Boolean'),
                      '.',
                      identifier('toJSBoolean')
                    ),
                    [identifier('a')]
                  ),
                  stringLiteral('abc')
                ),
                elseExpressionClause(identifier('c'))
              )
            ),
            variableDeclaratorValue(
              ifElseExpression(
                ifExpressionClause(
                  callExpression(
                    memberExpression(
                      identifier('Boolean'),
                      '.',
                      identifier('toJSBoolean')
                    ),
                    [identifier('a')]
                  ),
                  booleanLiteral(true)
                ),
                elseExpressionClause(identifier('c'))
              )
            ),
            variableDeclaratorValue(
              ifElseExpression(
                ifExpressionClause(
                  callExpression(
                    memberExpression(
                      identifier('Boolean'),
                      '.',
                      identifier('toJSBoolean')
                    ),
                    [identifier('a')]
                  ),
                  tableConstructor()
                ),
                elseExpressionClause(identifier('c'))
              )
            ),
            variableDeclaratorValue(
              ifElseExpression(
                ifExpressionClause(
                  callExpression(
                    memberExpression(
                      identifier('Boolean'),
                      '.',
                      identifier('toJSBoolean')
                    ),
                    [identifier('a')]
                  ),
                  tableConstructor()
                ),
                elseExpressionClause(identifier('c'))
              )
            ),
            variableDeclaratorValue(
              ifElseExpression(
                ifExpressionClause(
                  callExpression(
                    memberExpression(
                      identifier('Boolean'),
                      '.',
                      identifier('toJSBoolean')
                    ),
                    [identifier('a')]
                  ),
                  binaryExpression(numericLiteral(0), '/', numericLiteral(0))
                ),
                elseExpressionClause(identifier('c'))
              )
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });
});
