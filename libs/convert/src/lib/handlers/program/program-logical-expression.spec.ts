import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  booleanLiteral,
  callExpression,
  elseExpressionClause,
  identifier,
  ifElseExpression,
  ifExpressionClause,
  logicalExpression,
  LuaLogicalExpressionOperatorEnum,
  memberExpression,
  nilLiteral,
  nodeGroup,
  numericLiteral,
  stringLiteral,
  tableConstructor,
  typeAnnotation,
  typeBoolean,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from './program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Logical expression', () => {
    describe('should handle || operator', () => {
      it('with 2 identifiers', () => {
        const given = getProgramNode('const fizz = foo || bar;');

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
            [variableDeclaratorIdentifier(identifier('fizz'))],
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
                      [identifier('foo')]
                    ),
                    identifier('foo')
                  ),
                  identifier('bar')
                )
              ),
            ]
          ),
        ]);

        const luaProgram = convertProgram(source, {}, given);

        expect(luaProgram).toEqual(expected);
      });

      it('with 2 call expressions', () => {
        const given = getProgramNode('const fizz = foo() || bar();');

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
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('ref'))],
              [variableDeclaratorValue(callExpression(identifier('foo'), []))]
            ),
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('fizz'))],
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
                        [identifier('ref')]
                      ),
                      identifier('ref')
                    ),
                    callExpression(identifier('bar'), [])
                  )
                ),
              ]
            ),
          ]),
        ]);

        const luaProgram = convertProgram(source, {}, given);

        expect(JSON.stringify(luaProgram, undefined, 2)).toEqual(
          JSON.stringify(expected, undefined, 2)
        );
      });

      it('with multiple boolean inferable expressions', () => {
        const given = getProgramNode(`
          let fizz: boolean =
            foo === 1 ||
            bar === 2 ||
            baz === 3
        `);

        const expected = programWithUpstreamComment([
          variableDeclaration(
            [
              variableDeclaratorIdentifier(
                identifier('fizz', typeAnnotation(typeBoolean()))
              ),
            ],
            [
              variableDeclaratorValue(
                logicalExpression(
                  LuaLogicalExpressionOperatorEnum.OR,
                  logicalExpression(
                    LuaLogicalExpressionOperatorEnum.OR,
                    binaryExpression(
                      identifier('foo'),
                      '==',
                      numericLiteral(1, '1')
                    ),
                    binaryExpression(
                      identifier('bar'),
                      '==',
                      numericLiteral(2, '2')
                    )
                  ),
                  binaryExpression(
                    identifier('baz'),
                    '==',
                    numericLiteral(3, '3')
                  )
                )
              ),
            ]
          ),
        ]);

        const luaProgram = convertProgram(source, {}, given);

        expect(luaProgram).toEqual(expected);
      });
    });

    describe(`should handle && operator`, () => {
      it('when right side is unknown', () => {
        const given = getProgramNode('foo = foo && bar;');

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
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('foo')],
            [
              ifElseExpression(
                ifExpressionClause(
                  callExpression(
                    memberExpression(
                      identifier('Boolean'),
                      '.',
                      identifier('toJSBoolean')
                    ),
                    [identifier('foo')]
                  ),
                  identifier('bar')
                ),
                elseExpressionClause(identifier('foo'))
              ),
            ]
          ),
        ]);

        const luaProgram = convertProgram(source, {}, given);

        expect(luaProgram).toEqual(expected);
      });

      it('with 2 call expressions', () => {
        const given = getProgramNode('const fizz = foo() && bar();');

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
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('ref'))],
              [variableDeclaratorValue(callExpression(identifier('foo'), []))]
            ),
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('fizz'))],
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
                        [identifier('ref')]
                      ),
                      callExpression(identifier('bar'), [])
                    ),
                    elseExpressionClause(identifier('ref'))
                  )
                ),
              ]
            ),
          ]),
        ]);

        const luaProgram = convertProgram(source, {}, given);

        expect(JSON.stringify(luaProgram, undefined, 2)).toEqual(
          JSON.stringify(expected, undefined, 2)
        );
      });

      const falsyValues = [
        {
          code: 'bar = foo && false',
          leftExpected: identifier('foo'),
          rightExpected: booleanLiteral(false),
        },
        {
          code: 'bar = foo && null',
          leftExpected: identifier('foo'),
          rightExpected: nilLiteral(),
        },
        {
          code: 'bar = foo && undefined',
          leftExpected: identifier('foo'),
          rightExpected: nilLiteral(),
        },
      ];

      it.each(falsyValues)(
        `when right side is falsy: $code`,
        ({ code, leftExpected, rightExpected }) => {
          const given = getProgramNode(code);

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
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('bar')],
              [
                ifElseExpression(
                  ifExpressionClause(
                    callExpression(
                      memberExpression(
                        identifier('Boolean'),
                        '.',
                        identifier('toJSBoolean')
                      ),
                      [leftExpected]
                    ),
                    rightExpected
                  ),
                  elseExpressionClause(leftExpected)
                ),
              ]
            ),
          ]);

          const luaProgram = convertProgram(source, {}, given);

          expect(luaProgram).toEqual(expected);
        }
      );

      const truthyValues = [
        {
          code: 'bar = foo && 0',
          leftExpected: identifier('foo'),
          rightExpected: numericLiteral(0, '0'),
        },
        {
          code: 'bar = foo && 1',
          leftExpected: identifier('foo'),
          rightExpected: numericLiteral(1, '1'),
        },
        {
          code: 'bar = foo && ""',
          leftExpected: identifier('foo'),
          rightExpected: stringLiteral(''),
        },
        {
          code: 'bar = foo && "abc"',
          leftExpected: identifier('foo'),
          rightExpected: stringLiteral('abc'),
        },
        {
          code: 'bar = foo && true',
          leftExpected: identifier('foo'),
          rightExpected: booleanLiteral(true),
        },
        {
          code: 'bar = foo && {}',
          leftExpected: identifier('foo'),
          rightExpected: tableConstructor([]),
        },
        {
          code: 'bar = foo && []',
          leftExpected: identifier('foo'),
          rightExpected: tableConstructor([]),
        },
        {
          code: 'bar = foo && NaN',
          leftExpected: identifier('foo'),
          rightExpected: binaryExpression(
            numericLiteral(0),
            '/',
            numericLiteral(0)
          ),
        },
      ];

      it.each(truthyValues)(
        `when right side is truthy in Lua: %code`,
        ({ code, leftExpected, rightExpected }) => {
          const given = getProgramNode(code);

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
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('bar')],
              [
                ifElseExpression(
                  ifExpressionClause(
                    callExpression(
                      memberExpression(
                        identifier('Boolean'),
                        '.',
                        identifier('toJSBoolean')
                      ),
                      [leftExpected]
                    ),
                    rightExpected
                  ),
                  elseExpressionClause(leftExpected)
                ),
              ]
            ),
          ]);

          const luaProgram = convertProgram(source, {}, given);

          expect(luaProgram).toEqual(expected);
        }
      );

      it('with multiple boolean inferable expressions', () => {
        const given = getProgramNode(`
          let fizz: boolean =
            foo === 1 &&
            bar === 2 &&
            baz === 3
        `);

        const expected = programWithUpstreamComment([
          variableDeclaration(
            [
              variableDeclaratorIdentifier(
                identifier('fizz', typeAnnotation(typeBoolean()))
              ),
            ],
            [
              variableDeclaratorValue(
                logicalExpression(
                  LuaLogicalExpressionOperatorEnum.AND,
                  logicalExpression(
                    LuaLogicalExpressionOperatorEnum.AND,
                    binaryExpression(
                      identifier('foo'),
                      '==',
                      numericLiteral(1, '1')
                    ),
                    binaryExpression(
                      identifier('bar'),
                      '==',
                      numericLiteral(2, '2')
                    )
                  ),
                  binaryExpression(
                    identifier('baz'),
                    '==',
                    numericLiteral(3, '3')
                  )
                )
              ),
            ]
          ),
        ]);

        const luaProgram = convertProgram(source, {}, given);

        expect(luaProgram).toEqual(expected);
      });
    });

    describe(`should handle ?? operator`, () => {
      it('with 2 identifiers', () => {
        const given = getProgramNode('const fizz = foo ?? bar;');

        const expected = programWithUpstreamComment([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('fizz'))],
            [
              variableDeclaratorValue(
                ifElseExpression(
                  ifExpressionClause(
                    binaryExpression(identifier('foo'), '~=', nilLiteral()),
                    identifier('foo')
                  ),
                  elseExpressionClause(identifier('bar'))
                )
              ),
            ]
          ),
        ]);

        const luaProgram = convertProgram(source, {}, given);

        expect(JSON.stringify(luaProgram, undefined, 2)).toEqual(
          JSON.stringify(expected, undefined, 2)
        );
      });

      it('with 2 call expressions', () => {
        const given = getProgramNode('const fizz = foo() ?? bar();');

        const expected = programWithUpstreamComment([
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('ref'))],
              [variableDeclaratorValue(callExpression(identifier('foo'), []))]
            ),
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('fizz'))],
              [
                variableDeclaratorValue(
                  ifElseExpression(
                    ifExpressionClause(
                      binaryExpression(identifier('ref'), '~=', nilLiteral()),
                      identifier('ref')
                    ),
                    elseExpressionClause(callExpression(identifier('bar'), []))
                  )
                ),
              ]
            ),
          ]),
        ]);

        const luaProgram = convertProgram(source, {}, given);

        expect(JSON.stringify(luaProgram, undefined, 2)).toEqual(
          JSON.stringify(expected, undefined, 2)
        );
      });

      const falsyValues = [
        {
          code: 'bar = foo ?? false',
          leftExpected: identifier('foo'),
          rightExpected: booleanLiteral(false),
        },
        {
          code: 'bar = foo ?? null',
          leftExpected: identifier('foo'),
          rightExpected: nilLiteral(),
        },
        {
          code: 'bar = foo ?? undefined',
          leftExpected: identifier('foo'),
          rightExpected: nilLiteral(),
        },
      ];
      const truthyValues = [
        {
          code: 'bar = foo ?? 0',
          leftExpected: identifier('foo'),
          rightExpected: numericLiteral(0, '0'),
        },
        {
          code: 'bar = foo ?? 1',
          leftExpected: identifier('foo'),
          rightExpected: numericLiteral(1, '1'),
        },
        {
          code: 'bar = foo ?? ""',
          leftExpected: identifier('foo'),
          rightExpected: stringLiteral(''),
        },
        {
          code: 'bar = foo ?? "abc"',
          leftExpected: identifier('foo'),
          rightExpected: stringLiteral('abc'),
        },
        {
          code: 'bar = foo ?? true',
          leftExpected: identifier('foo'),
          rightExpected: booleanLiteral(true),
        },
        {
          code: 'bar = foo ?? {}',
          leftExpected: identifier('foo'),
          rightExpected: tableConstructor([]),
        },
        {
          code: 'bar = foo ?? []',
          leftExpected: identifier('foo'),
          rightExpected: tableConstructor([]),
        },
        {
          code: 'bar = foo ?? NaN',
          leftExpected: identifier('foo'),
          rightExpected: binaryExpression(
            numericLiteral(0),
            '/',
            numericLiteral(0)
          ),
        },
      ];

      it.each([...truthyValues, ...falsyValues])(
        `when right side is either truthy or falsy: %code`,
        ({ code, leftExpected, rightExpected }) => {
          const given = getProgramNode(code);

          const expected = programWithUpstreamComment([
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('bar')],
              [
                ifElseExpression(
                  ifExpressionClause(
                    binaryExpression(leftExpected, '~=', nilLiteral()),
                    leftExpected
                  ),
                  elseExpressionClause(rightExpected)
                ),
              ]
            ),
          ]);

          const luaProgram = convertProgram(source, {}, given);

          expect(luaProgram).toEqual(expected);
        }
      );
    });
  });
});
