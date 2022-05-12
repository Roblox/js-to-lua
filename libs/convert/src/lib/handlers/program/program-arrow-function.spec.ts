import { tableUnpackCall } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  callExpression,
  functionDeclaration,
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
  indexExpression,
  LuaProgram,
  LuaStatement,
  memberExpression,
  nilLiteral,
  nodeGroup,
  numericLiteral,
  program,
  returnStatement,
  stringLiteral,
  tableConstructor,
  tableNameKeyField,
  tableNoKeyField,
  typeAnnotation,
  typeAny,
  typeLiteral,
  typeNumber,
  typeOptional,
  typePropertySignature,
  typeReference,
  typeString,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleProgram } from './program.handler';
import { getProgramNode } from './program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Arrow Function', () => {
    it('should handle arrow function with no params', () => {
      const given = getProgramNode(`
        const foo = () => {}
      `);

      const expected: LuaProgram = program([
        functionDeclaration(identifier('foo'), [], nodeGroup([])),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle arrow function with params', () => {
      const given = getProgramNode(`
        const foo = (bar, baz) => {}
      `);

      const expected: LuaProgram = program([
        functionDeclaration(
          identifier('foo'),
          [identifier('bar'), identifier('baz')],
          nodeGroup([])
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle arrow function with optional params', () => {
      const given = getProgramNode(`
      const foo = (bar?, baz?: string) => {}
    `);
      const expected: LuaProgram = program([
        functionDeclaration(
          identifier('foo'),
          [
            identifier('bar', typeAnnotation(typeOptional(typeAny()))),
            identifier('baz', typeAnnotation(typeOptional(typeString()))),
          ],
          nodeGroup([])
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with destructured params', () => {
      const given = getProgramNode(`
        const foo = ({bar, baz}, [fizz,fuzz]) =>{}
      `);
      const expected: LuaProgram = program([
        functionDeclaration(
          identifier('foo'),
          [identifier('ref'), identifier('ref_')],

          nodeGroup([
            variableDeclaration(
              [
                variableDeclaratorIdentifier(identifier('bar')),
                variableDeclaratorIdentifier(identifier('baz')),
              ],
              [
                variableDeclaratorValue(
                  memberExpression(identifier('ref'), '.', identifier('bar'))
                ),
                variableDeclaratorValue(
                  memberExpression(identifier('ref'), '.', identifier('baz'))
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
                    identifier('ref_'),
                    numericLiteral(1),
                    numericLiteral(2)
                  )
                ),
              ]
            ),
          ])
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle arrow function with params and default values', () => {
      const given = getProgramNode(`
        const foo = (bar, baz = 'hello') => {}
      `);

      const expected: LuaProgram = program([
        functionDeclaration(
          identifier('foo'),
          [
            identifier('bar'),
            identifier('baz', typeAnnotation(typeOptional(typeString()))),
          ],
          nodeGroup([
            ifStatement(
              ifClause(
                binaryExpression(identifier('baz'), '==', nilLiteral()),
                nodeGroup([
                  assignmentStatement(
                    AssignmentStatementOperatorEnum.EQ,
                    [identifier('baz')],
                    [stringLiteral('hello')]
                  ),
                ])
              )
            ),
          ])
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle arrow function with body', () => {
      const given = getProgramNode(`
        const foo = (bar, baz = 'hello') => {
          let fizz = 'fuzz';
        }
      `);

      const expected: LuaProgram = program([
        functionDeclaration(
          identifier('foo'),
          [
            identifier('bar'),
            identifier('baz', typeAnnotation(typeOptional(typeString()))),
          ],
          nodeGroup([
            ifStatement(
              ifClause(
                binaryExpression(identifier('baz'), '==', nilLiteral()),
                nodeGroup([
                  assignmentStatement(
                    AssignmentStatementOperatorEnum.EQ,
                    [identifier('baz')],
                    [stringLiteral('hello')]
                  ),
                ])
              )
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

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle arrow function with expression as body', () => {
      const given = getProgramNode(`
        const foo = () => "wole"
      `);

      const expected: LuaProgram = program([
        functionDeclaration(
          identifier('foo'),
          [],
          nodeGroup([returnStatement(stringLiteral('wole'))])
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle arrow function with another arrow function', () => {
      const given = getProgramNode(`
        const foo = () => () => 31337
      `);

      const expected: LuaProgram = program([
        functionDeclaration(
          identifier('foo'),
          [],
          nodeGroup([
            returnStatement(
              functionExpression(
                [],
                nodeGroup([returnStatement(numericLiteral(31337, '31337'))])
              )
            ),
          ])
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle arrow function typed declaration', () => {
      const given = getProgramNode(`
        const foo: FooFunction = () => {}
      `);

      const expected: LuaProgram = program([
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

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with destructured object and typed', () => {
      const given = getProgramNode(`
        const reduce = ({ foo, bar }: Record<string, any>) => {
          return [foo, bar];
        }
      `);

      const expected: LuaProgram = program([
        functionDeclaration(
          identifier('reduce'),
          [
            identifier(
              'ref',
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
                  memberExpression(identifier('ref'), '.', identifier('foo'))
                ),
                variableDeclaratorValue(
                  memberExpression(identifier('ref'), '.', identifier('bar'))
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
      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with destructured array and typed', () => {
      const given = getProgramNode(`
        const reduce = ([foo, bar]: [string, string]) => {
          return { foo, bar };
        }
      `);

      const expected: LuaProgram = program([
        functionDeclaration(
          identifier('reduce'),
          [
            identifier(
              'ref',
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
                    identifier('ref'),
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
      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with destructured object/array, typed and with default params', () => {
      const given = getProgramNode(`
        const reduce = ({ foo }: { foo: string } = fizz, [bar]: [number] = fuzz) => {
          return [foo, bar];
        }
      `);

      const expected: LuaProgram = program([
        functionDeclaration(
          identifier('reduce'),
          [
            identifier(
              'ref',
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
              'ref_',
              typeAnnotation(
                typeOptional(typeReference(identifier('Array'), [typeNumber()]))
              )
            ),
          ],
          nodeGroup([
            nodeGroup([
              ifStatement(
                ifClause(
                  binaryExpression(identifier('ref'), '==', nilLiteral()),
                  nodeGroup([
                    assignmentStatement(
                      AssignmentStatementOperatorEnum.EQ,
                      [identifier('ref')],
                      [identifier('fizz')]
                    ),
                  ])
                )
              ),
              variableDeclaration(
                [variableDeclaratorIdentifier(identifier('foo'))],
                [
                  variableDeclaratorValue(
                    memberExpression(identifier('ref'), '.', identifier('foo'))
                  ),
                ]
              ),
            ]),
            nodeGroup([
              ifStatement(
                ifClause(
                  binaryExpression(identifier('ref_'), '==', nilLiteral()),
                  nodeGroup([
                    assignmentStatement(
                      AssignmentStatementOperatorEnum.EQ,
                      [identifier('ref_')],
                      [identifier('fuzz')]
                    ),
                  ])
                )
              ),
              variableDeclaration(
                [variableDeclaratorIdentifier(identifier('bar'))],
                [
                  variableDeclaratorValue(
                    indexExpression(identifier('ref_'), numericLiteral(1))
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
      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    describe('async', () => {
      it('should handle arrow function with params', () => {
        const given = getProgramNode(`
          const foo = async (bar, baz) => {}
        `);

        const expected: LuaProgram = program([
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

        const luaProgram = handleProgram.handler(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });

      it('should handle arrow function with params and default values', () => {
        const given = getProgramNode(`
          const foo = async (bar, baz = 'hello') => {}
        `);

        const expected: LuaProgram = program([
          functionDeclaration(
            identifier('foo'),
            [
              identifier('bar'),
              identifier('baz', typeAnnotation(typeOptional(typeString()))),
            ],
            nodeGroup([
              ifStatement(
                ifClause(
                  binaryExpression(identifier('baz'), '==', nilLiteral()),
                  nodeGroup([
                    assignmentStatement(
                      AssignmentStatementOperatorEnum.EQ,
                      [identifier('baz')],
                      [stringLiteral('hello')]
                    ),
                  ])
                )
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

        const luaProgram = handleProgram.handler(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });

      it('should handle arrow function with body', () => {
        const given = getProgramNode(`
          const foo = async (bar, baz = 'hello') => {
            let fizz = 'fuzz';
          }
        `);

        const expected: LuaProgram = program([
          functionDeclaration(
            identifier('foo'),
            [
              identifier('bar'),
              identifier('baz', typeAnnotation(typeOptional(typeString()))),
            ],
            nodeGroup([
              ifStatement(
                ifClause(
                  binaryExpression(identifier('baz'), '==', nilLiteral()),
                  nodeGroup([
                    assignmentStatement(
                      AssignmentStatementOperatorEnum.EQ,
                      [identifier('baz')],
                      [stringLiteral('hello')]
                    ),
                  ])
                )
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

        const luaProgram = handleProgram.handler(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });

      it('should handle arrow function with expression as body', () => {
        const given = getProgramNode(`
          const foo = async () => "wole"
        `);

        const expected: LuaProgram = program([
          functionDeclaration(
            identifier('foo'),
            [],
            nodeGroup([
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
                      nodeGroup([returnStatement(stringLiteral('wole'))])
                    ),
                  ]
                )
              ),
            ])
          ),
        ]);

        const luaProgram = handleProgram.handler(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });

      it('should handle arrow function with another arrow function', () => {
        const given = getProgramNode(`
          const foo = async () => async () => 31337
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

        const expected = program([
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

        const luaProgram = handleProgram.handler(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });
    });
  });
});
