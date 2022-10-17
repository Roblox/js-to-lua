import {
  tableUnpackCall,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  callExpression,
  elseExpressionClause,
  functionDeclaration,
  functionExpression,
  identifier,
  ifElseExpression,
  ifExpressionClause,
  indexExpression,
  LuaProgram,
  LuaStatement,
  memberExpression,
  nilLiteral,
  nodeGroup,
  numericLiteral,
  returnStatement,
  stringLiteral,
  tableConstructor,
  tableNameKeyField,
  tableNoKeyField,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeIndexSignature,
  typeLiteral,
  typeNumber,
  typeOptional,
  typeParameterDeclaration,
  typePropertySignature,
  typeReference,
  typeString,
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
  describe('Function Expressions', () => {
    it('should ignore function name', () => {
      const given = getProgramNode(`
        const foo = function foo() {}
      `);

      const expected: LuaProgram = programWithUpstreamComment([
        functionDeclaration(identifier('foo'), [], nodeGroup([])),
      ]);
      const luaProgram = convertProgram(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with no params', () => {
      const given = getProgramNode(`
        const foo = function () {}
      `);

      const expected: LuaProgram = programWithUpstreamComment([
        functionDeclaration(identifier('foo'), [], nodeGroup([])),
      ]);
      const luaProgram = convertProgram(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with params', () => {
      const given = getProgramNode(`
        const foo = function (bar, baz) {}
      `);

      const expected: LuaProgram = programWithUpstreamComment([
        functionDeclaration(
          identifier('foo'),
          [identifier('bar'), identifier('baz')],
          nodeGroup([])
        ),
      ]);

      const luaProgram = convertProgram(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with optional params', () => {
      const given = getProgramNode(`
      const foo = function (bar?, baz?: string) {}
    `);
      const expected: LuaProgram = programWithUpstreamComment([
        functionDeclaration(
          identifier('foo'),
          [
            identifier('bar', typeAnnotation(typeOptional(typeAny()))),
            identifier('baz', typeAnnotation(typeOptional(typeString()))),
          ],
          nodeGroup([])
        ),
      ]);

      const luaProgram = convertProgram(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with destructured params', () => {
      const given = getProgramNode(`
        const foo = function({bar, baz}, [fizz,fuzz]) {}
      `);
      const expected: LuaProgram = programWithUpstreamComment([
        functionDeclaration(
          identifier('foo'),
          [identifier('ref0'), identifier('ref1')],
          nodeGroup([
            variableDeclaration(
              [
                variableDeclaratorIdentifier(identifier('bar')),
                variableDeclaratorIdentifier(identifier('baz')),
              ],
              [
                variableDeclaratorValue(
                  memberExpression(identifier('ref0'), '.', identifier('bar'))
                ),
                variableDeclaratorValue(
                  memberExpression(identifier('ref0'), '.', identifier('baz'))
                ),
              ]
            ),
            variableDeclaration(
              [
                variableDeclaratorIdentifier(identifier('fizz')),
                variableDeclaratorIdentifier(identifier('fuzz')),
              ],
              [
                variableDeclaratorValue(
                  tableUnpackCall(
                    identifier('ref1'),
                    numericLiteral(1),
                    numericLiteral(2)
                  )
                ),
              ]
            ),
          ])
        ),
      ]);

      const luaProgram = convertProgram(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with params and default values', () => {
      const given = getProgramNode(`
        const foo = function (bar, baz = 'hello') {}
      `);

      const expected: LuaProgram = programWithUpstreamComment([
        functionDeclaration(
          identifier('foo'),
          [
            identifier('bar'),
            identifier('baz_', typeAnnotation(typeOptional(typeString()))),
          ],
          nodeGroup([
            variableDeclaration(
              [
                variableDeclaratorIdentifier(
                  identifier('baz', typeAnnotation(typeString()))
                ),
              ],
              [
                variableDeclaratorValue(
                  ifElseExpression(
                    ifExpressionClause(
                      binaryExpression(identifier('baz_'), '~=', nilLiteral()),
                      identifier('baz_')
                    ),
                    elseExpressionClause(stringLiteral('hello'))
                  )
                ),
              ]
            ),
          ])
        ),
      ]);

      const luaProgram = convertProgram(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with function body', () => {
      const given = getProgramNode(`
        const foo = function (bar, baz = 'hello') {
          let fizz = 'fuzz';
        }
      `);

      const expected: LuaProgram = programWithUpstreamComment([
        functionDeclaration(
          identifier('foo'),
          [
            identifier('bar'),
            identifier('baz_', typeAnnotation(typeOptional(typeString()))),
          ],
          nodeGroup([
            variableDeclaration(
              [
                variableDeclaratorIdentifier(
                  identifier('baz', typeAnnotation(typeString()))
                ),
              ],
              [
                variableDeclaratorValue(
                  ifElseExpression(
                    ifExpressionClause(
                      binaryExpression(identifier('baz_'), '~=', nilLiteral()),
                      identifier('baz_')
                    ),
                    elseExpressionClause(stringLiteral('hello'))
                  )
                ),
              ]
            ),
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(identifier('fizz'))],
                [variableDeclaratorValue(stringLiteral('fuzz'))]
              ),
            ]),
          ])
        ),
      ]);

      const luaProgram = convertProgram(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function typed', () => {
      const given = getProgramNode(`
        const foo: FooFunction = function () {}
      `);

      const expected: LuaProgram = programWithUpstreamComment([
        nodeGroup([
          variableDeclaration(
            [
              variableDeclaratorIdentifier(
                identifier(
                  'foo',
                  typeAnnotation(typeReference(identifier('FooFunction')))
                )
              ),
            ],
            []
          ),
          functionDeclaration(
            identifier('foo'),
            [],
            nodeGroup([]),
            undefined,
            false
          ),
        ]),
      ]);
      const luaProgram = convertProgram(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with destructured object and typed', () => {
      const given = getProgramNode(`
        const reduce = function({ foo, bar }: Record<string, any>) {
          return [foo, bar];
        }
      `);

      const expected: LuaProgram = programWithUpstreamComment([
        withTrailingConversionComment(
          typeAliasDeclaration(
            identifier('Record'),
            typeLiteral([
              typeIndexSignature(
                typeReference(identifier('K')),
                typeAnnotation(typeReference(identifier('T')))
              ),
            ]),
            typeParameterDeclaration([
              typeReference(identifier('K')),
              typeReference(identifier('T')),
            ])
          ),
          "ROBLOX TODO: TS 'Record' built-in type is not available in Luau"
        ),
        functionDeclaration(
          identifier('reduce'),
          [
            identifier(
              'ref0',
              typeAnnotation(
                typeReference(identifier('Record'), [typeString(), typeAny()])
              )
            ),
          ],
          nodeGroup([
            variableDeclaration(
              [
                variableDeclaratorIdentifier(identifier('foo')),
                variableDeclaratorIdentifier(identifier('bar')),
              ],
              [
                variableDeclaratorValue(
                  memberExpression(identifier('ref0'), '.', identifier('foo'))
                ),
                variableDeclaratorValue(
                  memberExpression(identifier('ref0'), '.', identifier('bar'))
                ),
              ]
            ),
            nodeGroup([
              returnStatement(
                tableConstructor([
                  tableNoKeyField(identifier('foo')),
                  tableNoKeyField(identifier('bar')),
                ])
              ),
            ]),
          ])
        ),
      ]);
      const luaProgram = convertProgram(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with destructured array and typed', () => {
      const given = getProgramNode(`
        const reduce = function([foo, bar]: [string, string]) {
          return { foo, bar };
        }
      `);

      const expected: LuaProgram = programWithUpstreamComment([
        functionDeclaration(
          identifier('reduce'),
          [
            identifier(
              'ref0',
              typeAnnotation(typeReference(identifier('Array'), [typeString()]))
            ),
          ],
          nodeGroup([
            variableDeclaration(
              [
                variableDeclaratorIdentifier(identifier('foo')),
                variableDeclaratorIdentifier(identifier('bar')),
              ],
              [
                variableDeclaratorValue(
                  tableUnpackCall(
                    identifier('ref0'),
                    numericLiteral(1),
                    numericLiteral(2)
                  )
                ),
              ]
            ),
            nodeGroup([
              returnStatement(
                tableConstructor([
                  tableNameKeyField(identifier('foo'), identifier('foo')),
                  tableNameKeyField(identifier('bar'), identifier('bar')),
                ])
              ),
            ]),
          ])
        ),
      ]);
      const luaProgram = convertProgram(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with destructured object/array, typed and with default params', () => {
      const given = getProgramNode(`
        const reduce = function({ foo }: { foo: string } = fizz, [bar]: [number] = fuzz) {
          return [foo, bar];
        }
      `);

      const expected: LuaProgram = programWithUpstreamComment([
        functionDeclaration(
          identifier('reduce'),
          [
            identifier(
              'ref0_',
              typeAnnotation(
                typeOptional(
                  typeLiteral([
                    typePropertySignature(
                      identifier('foo'),
                      typeAnnotation(typeString())
                    ),
                  ])
                )
              )
            ),
            identifier(
              'ref1_',
              typeAnnotation(
                typeOptional(typeReference(identifier('Array'), [typeNumber()]))
              )
            ),
          ],
          nodeGroup([
            nodeGroup([
              variableDeclaration(
                [
                  variableDeclaratorIdentifier(
                    identifier(
                      'ref0',
                      typeAnnotation(
                        typeLiteral([
                          typePropertySignature(
                            identifier('foo'),
                            typeAnnotation(typeString())
                          ),
                        ])
                      )
                    )
                  ),
                ],
                [
                  variableDeclaratorValue(
                    ifElseExpression(
                      ifExpressionClause(
                        binaryExpression(
                          identifier('ref0_'),
                          '~=',
                          nilLiteral()
                        ),
                        identifier('ref0_')
                      ),
                      elseExpressionClause(identifier('fizz'))
                    )
                  ),
                ]
              ),
              variableDeclaration(
                [variableDeclaratorIdentifier(identifier('foo'))],
                [
                  variableDeclaratorValue(
                    memberExpression(identifier('ref0'), '.', identifier('foo'))
                  ),
                ]
              ),
            ]),
            nodeGroup([
              variableDeclaration(
                [
                  variableDeclaratorIdentifier(
                    identifier(
                      'ref1',
                      typeAnnotation(
                        typeReference(identifier('Array'), [typeNumber()])
                      )
                    )
                  ),
                ],
                [
                  variableDeclaratorValue(
                    ifElseExpression(
                      ifExpressionClause(
                        binaryExpression(
                          identifier('ref1_'),
                          '~=',
                          nilLiteral()
                        ),
                        identifier('ref1_')
                      ),
                      elseExpressionClause(identifier('fuzz'))
                    )
                  ),
                ]
              ),
              variableDeclaration(
                [variableDeclaratorIdentifier(identifier('bar'))],
                [
                  variableDeclaratorValue(
                    indexExpression(identifier('ref1'), numericLiteral(1))
                  ),
                ]
              ),
            ]),
            nodeGroup([
              returnStatement(
                tableConstructor([
                  tableNoKeyField(identifier('foo')),
                  tableNoKeyField(identifier('bar')),
                ])
              ),
            ]),
          ])
        ),
      ]);
      const luaProgram = convertProgram(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    describe('async', () => {
      it('should handle function with params', () => {
        const given = getProgramNode(`
          const foo = async function(bar, baz) {}
        `);

        const expected: LuaProgram = programWithUpstreamComment([
          withTrailingConversionComment(
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Packages'))],
              []
            ),
            'ROBLOX comment: must define Packages module'
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Promise'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  memberExpression(
                    identifier('Packages'),
                    '.',
                    identifier('Promise')
                  ),
                ])
              ),
            ]
          ),
          functionDeclaration(
            identifier('foo'),
            [identifier('bar'), identifier('baz')],
            nodeGroup([
              returnStatement(
                callExpression(
                  memberExpression(
                    identifier('Promise'),
                    '.',
                    identifier('resolve')
                  ),
                  [nilLiteral()]
                )
              ),
            ])
          ),
        ]);

        const luaProgram = convertProgram(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });

      it('should handle function with params and default values', () => {
        const given = getProgramNode(`
          const foo = async function(bar, baz = 'hello') {}
        `);

        const expected: LuaProgram = programWithUpstreamComment([
          withTrailingConversionComment(
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Packages'))],
              []
            ),
            'ROBLOX comment: must define Packages module'
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Promise'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  memberExpression(
                    identifier('Packages'),
                    '.',
                    identifier('Promise')
                  ),
                ])
              ),
            ]
          ),
          functionDeclaration(
            identifier('foo'),
            [
              identifier('bar'),
              identifier('baz_', typeAnnotation(typeOptional(typeString()))),
            ],
            nodeGroup([
              variableDeclaration(
                [
                  variableDeclaratorIdentifier(
                    identifier('baz', typeAnnotation(typeString()))
                  ),
                ],
                [
                  variableDeclaratorValue(
                    ifElseExpression(
                      ifExpressionClause(
                        binaryExpression(
                          identifier('baz_'),
                          '~=',
                          nilLiteral()
                        ),
                        identifier('baz_')
                      ),
                      elseExpressionClause(stringLiteral('hello'))
                    )
                  ),
                ]
              ),
              returnStatement(
                callExpression(
                  memberExpression(
                    identifier('Promise'),
                    '.',
                    identifier('resolve')
                  ),
                  [nilLiteral()]
                )
              ),
            ])
          ),
        ]);

        const luaProgram = convertProgram(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });

      it('should handle function with body', () => {
        const given = getProgramNode(`
          const foo = async function(bar, baz = 'hello') {
            let fizz = 'fuzz';
          }
        `);

        const expected: LuaProgram = programWithUpstreamComment([
          withTrailingConversionComment(
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Packages'))],
              []
            ),
            'ROBLOX comment: must define Packages module'
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Promise'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  memberExpression(
                    identifier('Packages'),
                    '.',
                    identifier('Promise')
                  ),
                ])
              ),
            ]
          ),
          functionDeclaration(
            identifier('foo'),
            [
              identifier('bar'),
              identifier('baz_', typeAnnotation(typeOptional(typeString()))),
            ],
            nodeGroup([
              variableDeclaration(
                [
                  variableDeclaratorIdentifier(
                    identifier('baz', typeAnnotation(typeString()))
                  ),
                ],
                [
                  variableDeclaratorValue(
                    ifElseExpression(
                      ifExpressionClause(
                        binaryExpression(
                          identifier('baz_'),
                          '~=',
                          nilLiteral()
                        ),
                        identifier('baz_')
                      ),
                      elseExpressionClause(stringLiteral('hello'))
                    )
                  ),
                ]
              ),
              returnStatement(
                callExpression(
                  memberExpression(
                    callExpression(
                      memberExpression(
                        identifier('Promise'),
                        '.',
                        identifier('resolve')
                      ),
                      []
                    ),
                    ':',
                    identifier('andThen')
                  ),
                  [
                    functionExpression(
                      [],
                      nodeGroup([
                        variableDeclaration(
                          [variableDeclaratorIdentifier(identifier('fizz'))],
                          [variableDeclaratorValue(stringLiteral('fuzz'))]
                        ),
                      ])
                    ),
                  ]
                )
              ),
            ])
          ),
        ]);

        const luaProgram = convertProgram(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });

      it('should handle double async function expression', () => {
        const given = getProgramNode(`
          const foo = async function() {
            return async function() {
              return 31337
            }
          }
        `);

        const promiseResolveAndThenCallExpression = (callBody: LuaStatement) =>
          callExpression(
            memberExpression(
              callExpression(
                memberExpression(
                  identifier('Promise'),
                  '.',
                  identifier('resolve')
                ),
                []
              ),
              ':',
              identifier('andThen')
            ),
            [functionExpression([], nodeGroup([callBody]))]
          );

        const expected = programWithUpstreamComment([
          withTrailingConversionComment(
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Packages'))],
              []
            ),
            'ROBLOX comment: must define Packages module'
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Promise'))],
            [
              variableDeclaratorValue(
                callExpression(identifier('require'), [
                  memberExpression(
                    identifier('Packages'),
                    '.',
                    identifier('Promise')
                  ),
                ])
              ),
            ]
          ),
          functionDeclaration(
            identifier('foo'),
            [],
            nodeGroup([
              returnStatement(
                promiseResolveAndThenCallExpression(
                  returnStatement(
                    functionExpression(
                      [],
                      nodeGroup([
                        returnStatement(
                          promiseResolveAndThenCallExpression(
                            returnStatement(numericLiteral(31337, '31337'))
                          )
                        ),
                      ])
                    )
                  )
                )
              ),
            ])
          ),
        ]);

        const luaProgram = convertProgram(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });
    });
  });
});
