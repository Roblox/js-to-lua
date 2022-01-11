import {
  binaryExpression,
  booleanLiteral,
  callExpression,
  elseClause,
  expressionStatement,
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
  logicalExpression,
  LuaLogicalExpressionOperatorEnum,
  LuaProgram,
  memberExpression,
  nilLiteral,
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
import { handleProgram } from './program.handler';
import { getProgramNode } from './program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Logical expression', () => {
    it('should handle || operator', () => {
      const given = getProgramNode('foo || bar;');

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
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
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
                [
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
                      [returnStatement(identifier('bar'))]
                    ),
                    [],
                    elseClause([returnStatement(identifier('foo'))])
                  ),
                ]
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
          code: 'foo && false',
          leftExpected: identifier('foo'),
          rightExpected: booleanLiteral(false),
        },
        {
          code: 'foo && null',
          leftExpected: identifier('foo'),
          rightExpected: nilLiteral(),
        },
        {
          code: 'foo && undefined',
          leftExpected: identifier('foo'),
          rightExpected: nilLiteral(),
        },
      ];

      falsyValues.forEach(({ code, leftExpected, rightExpected }) => {
        it(`when right side is falsy: ${JSON.stringify(code)}`, () => {
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
            expressionStatement(
              callExpression(
                functionExpression(
                  [],
                  [
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
                        [returnStatement(rightExpected)]
                      ),
                      [],
                      elseClause([returnStatement(leftExpected)])
                    ),
                  ]
                ),
                []
              )
            ),
          ]);

          const luaProgram = handleProgram.handler(source, {}, given);

          expect(luaProgram).toEqual(expected);
        });
      });

      const truthyValues = [
        {
          code: 'foo && 0',
          leftExpected: identifier('foo'),
          rightExpected: numericLiteral(0, '0'),
        },
        {
          code: 'foo && 1',
          leftExpected: identifier('foo'),
          rightExpected: numericLiteral(1, '1'),
        },
        {
          code: 'foo && ""',
          leftExpected: identifier('foo'),
          rightExpected: stringLiteral(''),
        },
        {
          code: 'foo && "abc"',
          leftExpected: identifier('foo'),
          rightExpected: stringLiteral('abc'),
        },
        {
          code: 'foo && true',
          leftExpected: identifier('foo'),
          rightExpected: booleanLiteral(true),
        },
        {
          code: 'foo && {}',
          leftExpected: identifier('foo'),
          rightExpected: tableConstructor([]),
        },
        {
          code: 'foo && []',
          leftExpected: identifier('foo'),
          rightExpected: tableConstructor([]),
        },
        {
          code: 'foo && NaN',
          leftExpected: identifier('foo'),
          rightExpected: binaryExpression(
            numericLiteral(0),
            '/',
            numericLiteral(0)
          ),
        },
      ];

      truthyValues.forEach(({ code, leftExpected, rightExpected }) => {
        it(`when right side is truthy in Lua: ${JSON.stringify(code)}`, () => {
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
            expressionStatement(
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
              )
            ),
          ]);

          const luaProgram = handleProgram.handler(source, {}, given);

          expect(luaProgram).toEqual(expected);
        });
      });
    });
  });
});
