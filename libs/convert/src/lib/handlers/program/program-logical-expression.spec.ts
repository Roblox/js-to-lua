import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  booleanLiteral,
  callExpression,
  elseClause,
  elseExpressionClause,
  expressionStatement,
  functionExpression,
  identifier,
  ifClause,
  ifElseExpression,
  ifExpressionClause,
  ifStatement,
  logicalExpression,
  LuaLogicalExpressionOperatorEnum,
  LuaProgram,
  memberExpression,
  nilLiteral,
  nodeGroup,
  numericLiteral,
  program,
  returnStatement,
  stringLiteral,
  tableConstructor,
  typeAnnotation,
  typeBoolean,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleProgram } from './program.handler';
import { getProgramNode } from './program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Logical expression', () => {
    describe('should handle || operator', () => {
      it('with 2 identifiers', () => {
        const given = getProgramNode('const fizz = foo || bar;');

        const expected: LuaProgram = program([
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

        const luaProgram = handleProgram.handler(source, {}, given);

        expect(luaProgram).toEqual(expected);
      });

      it('with multiple boolean inferable expressions', () => {
        const given = getProgramNode(`
          let fizz: boolean =
            foo === 1 ||
            bar === 2 ||
            baz === 3
        `);

        const expected = program([
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

        const luaProgram = handleProgram.handler(source, {}, given);

        expect(luaProgram).toEqual(expected);
      });
    });

    describe(`should handle && operator`, () => {
      it('when right side is unknown', () => {
        const given = getProgramNode('foo && bar;');

        const expected: LuaProgram = program([
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
          expressionStatement(
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
                        [identifier('foo')]
                      ),
                      nodeGroup([returnStatement(identifier('bar'))])
                    ),
                    [],
                    elseClause(nodeGroup([returnStatement(identifier('foo'))]))
                  ),
                ])
              ),
              []
            )
          ),
        ]);

        const luaProgram = handleProgram.handler(source, {}, given);

        expect(luaProgram).toEqual(expected);
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

          const expected: LuaProgram = program([
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
                            [leftExpected]
                          ),
                          nodeGroup([returnStatement(rightExpected)])
                        ),
                        [],
                        elseClause(nodeGroup([returnStatement(leftExpected)]))
                      ),
                    ])
                  ),
                  []
                ),
              ]
            ),
          ]);

          const luaProgram = handleProgram.handler(source, {}, given);

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

          const expected: LuaProgram = program([
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
                      [leftExpected]
                    ),
                    rightExpected
                  ),
                  leftExpected
                ),
              ]
            ),
          ]);

          const luaProgram = handleProgram.handler(source, {}, given);

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

        const expected = program([
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

        const luaProgram = handleProgram.handler(source, {}, given);

        expect(luaProgram).toEqual(expected);
      });
    });

    describe(`should handle ?? operator`, () => {
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

          const expected: LuaProgram = program([
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

          const luaProgram = handleProgram.handler(source, {}, given);

          expect(luaProgram).toEqual(expected);
        }
      );
    });
  });
});
