import {
  binaryExpression,
  booleanLiteral,
  callExpression,
  elseClause,
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
  logicalExpression,
  LuaLogicalExpressionOperatorEnum,
  memberExpression,
  nilLiteral,
  nodeGroup,
  numericLiteral,
  program,
  returnStatement,
  stringLiteral,
  tableConstructor,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

describe('Program handler', () => {
  describe('Conditional Expression Handler', () => {
    it(`should handle ConditionalExpression - when consequent expression in unknown`, () => {
      const source = `
      let foo = a ? b : c
    `;
      const given = getProgramNode(source);
      const expected = program([
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
              callExpression(
                functionExpression(
                  [],
                  nodeGroup([
                    ifStatement(
                      ifClause(
                        callExpression(
                          memberExpression(
                            identifier('Boolean'),
                            '.',
                            identifier('toJSBoolean')
                          ),
                          [identifier('a')]
                        ),
                        nodeGroup([returnStatement(identifier('b'))])
                      ),
                      [],
                      elseClause(nodeGroup([returnStatement(identifier('c'))]))
                    ),
                  ])
                ),
                []
              )
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
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

    coercableTestCases.forEach(({ values, coerced }) => {
      values.forEach((testGiven) => {
        it(`should handle ConditionalExpression - with test expression coercion: ${JSON.stringify(
          testGiven
        )}`, () => {
          const source = `
          let foo = ${testGiven} ? b : c
        `;
          const given = getProgramNode(source);
          const expected = program([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('foo'))],
              [
                variableDeclaratorValue(
                  callExpression(
                    functionExpression(
                      [],
                      nodeGroup([
                        ifStatement(
                          ifClause(
                            coerced(testGiven),
                            nodeGroup([returnStatement(identifier('b'))])
                          ),
                          [],
                          elseClause(
                            nodeGroup([returnStatement(identifier('c'))])
                          )
                        ),
                      ])
                    ),
                    []
                  )
                ),
              ]
            ),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });
      });
    });

    it(`should handle ConditionalExpression when consequent expression is falsy`, () => {
      const source = `
        let foo0 = a ? false : c,
            foo1 = a ? null : c,
            foo2 = a ? undefined : c
      `;
      const given = getProgramNode(source);
      const expected = program([
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
              callExpression(
                functionExpression(
                  [],
                  nodeGroup([
                    ifStatement(
                      ifClause(
                        callExpression(
                          memberExpression(
                            identifier('Boolean'),
                            '.',
                            identifier('toJSBoolean')
                          ),
                          [identifier('a')]
                        ),
                        nodeGroup([returnStatement(booleanLiteral(false))])
                      ),
                      [],
                      elseClause(nodeGroup([returnStatement(identifier('c'))]))
                    ),
                  ])
                ),
                []
              )
            ),
            variableDeclaratorValue(
              callExpression(
                functionExpression(
                  [],
                  nodeGroup([
                    ifStatement(
                      ifClause(
                        callExpression(
                          memberExpression(
                            identifier('Boolean'),
                            '.',
                            identifier('toJSBoolean')
                          ),
                          [identifier('a')]
                        ),
                        nodeGroup([returnStatement(nilLiteral())])
                      ),
                      [],
                      elseClause(nodeGroup([returnStatement(identifier('c'))]))
                    ),
                  ])
                ),
                []
              )
            ),
            variableDeclaratorValue(
              callExpression(
                functionExpression(
                  [],
                  nodeGroup([
                    ifStatement(
                      ifClause(
                        callExpression(
                          memberExpression(
                            identifier('Boolean'),
                            '.',
                            identifier('toJSBoolean')
                          ),
                          [identifier('a')]
                        ),
                        nodeGroup([returnStatement(nilLiteral())])
                      ),
                      [],
                      elseClause(nodeGroup([returnStatement(identifier('c'))]))
                    ),
                  ])
                ),
                []
              )
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
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
      const expected = program([
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
              logicalExpression(
                LuaLogicalExpressionOperatorEnum.OR,
                logicalExpression(
                  LuaLogicalExpressionOperatorEnum.AND,
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
                identifier('c')
              )
            ),
            variableDeclaratorValue(
              logicalExpression(
                LuaLogicalExpressionOperatorEnum.OR,
                logicalExpression(
                  LuaLogicalExpressionOperatorEnum.AND,
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
                identifier('c')
              )
            ),
            variableDeclaratorValue(
              logicalExpression(
                LuaLogicalExpressionOperatorEnum.OR,
                logicalExpression(
                  LuaLogicalExpressionOperatorEnum.AND,
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
                identifier('c')
              )
            ),
            variableDeclaratorValue(
              logicalExpression(
                LuaLogicalExpressionOperatorEnum.OR,
                logicalExpression(
                  LuaLogicalExpressionOperatorEnum.AND,
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
                identifier('c')
              )
            ),
            variableDeclaratorValue(
              logicalExpression(
                LuaLogicalExpressionOperatorEnum.OR,
                logicalExpression(
                  LuaLogicalExpressionOperatorEnum.AND,
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
                identifier('c')
              )
            ),
            variableDeclaratorValue(
              logicalExpression(
                LuaLogicalExpressionOperatorEnum.OR,
                logicalExpression(
                  LuaLogicalExpressionOperatorEnum.AND,
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
                identifier('c')
              )
            ),
            variableDeclaratorValue(
              logicalExpression(
                LuaLogicalExpressionOperatorEnum.OR,
                logicalExpression(
                  LuaLogicalExpressionOperatorEnum.AND,
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
                identifier('c')
              )
            ),
            variableDeclaratorValue(
              logicalExpression(
                LuaLogicalExpressionOperatorEnum.OR,
                logicalExpression(
                  LuaLogicalExpressionOperatorEnum.AND,
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
                identifier('c')
              )
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
