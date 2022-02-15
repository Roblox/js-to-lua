import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  blockStatement,
  callExpression,
  elseClause,
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
  indexExpression,
  LuaProgram,
  memberExpression,
  nilLiteral,
  nodeGroup,
  numericLiteral,
  program,
  returnStatement,
  stringLiteral,
  tableConstructor,
  tableExpressionKeyField,
  tableNameKeyField,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Variable Declarations', () => {
    it('should handle let: not initialized', () => {
      const given = getProgramNode(`
     let foo;
    `);
      const expected: LuaProgram = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          []
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });

  it('should handle let: initialized', () => {
    const given = getProgramNode(`
   let foo = 'foo';
  `);
    const expected: LuaProgram = program([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [variableDeclaratorValue(stringLiteral('foo'))]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle let: multiple', () => {
    const given = getProgramNode(`
    let foo, bar = 'bar';
  `);
    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('foo')),
          variableDeclaratorIdentifier(identifier('bar')),
        ],
        [
          variableDeclaratorValue(null),
          variableDeclaratorValue(stringLiteral('bar')),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle let: multiple - partially initialized', () => {
    const given = getProgramNode(`
    let foo = 'foo', bar;
  `);
    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('foo')),
          variableDeclaratorIdentifier(identifier('bar')),
        ],
        [variableDeclaratorValue(stringLiteral('foo'))]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle const', () => {
    const given = getProgramNode(`
   const foo = 'foo';
  `);
    const expected: LuaProgram = program([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [variableDeclaratorValue(stringLiteral('foo'))]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle const: multiple', () => {
    const given = getProgramNode(`
    const foo = 'foo', bar = 'bar';

  `);
    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('foo')),
          variableDeclaratorIdentifier(identifier('bar')),
        ],
        [
          variableDeclaratorValue(stringLiteral('foo')),
          variableDeclaratorValue(stringLiteral('bar')),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle var: not initialized', () => {
    const given = getProgramNode(`
    var foo;
  `);
    const expected: LuaProgram = program([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        []
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle var: initialized', () => {
    const given = getProgramNode(`
   var foo = 'foo';
  `);
    const expected: LuaProgram = program([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [variableDeclaratorValue(stringLiteral('foo'))]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle var: multiple', () => {
    const given = getProgramNode(`
   var foo, bar = 'bar';
  `);
    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('foo')),
          variableDeclaratorIdentifier(identifier('bar')),
        ],
        [
          variableDeclaratorValue(null),
          variableDeclaratorValue(stringLiteral('bar')),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle var: multiple - partially initialized', () => {
    const given = getProgramNode(`
   var foo = 'foo', bar;
  `);
    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('foo')),
          variableDeclaratorIdentifier(identifier('bar')),
        ],
        [variableDeclaratorValue(stringLiteral('foo'))]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle array destructuring`, () => {
    const given = getProgramNode(`
    const [foo, bar] = baz;
  `);

    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('foo')),
          variableDeclaratorIdentifier(identifier('bar')),
        ],
        [
          variableDeclaratorValue(
            callExpression(identifier('table.unpack'), [
              identifier('baz'),
              numericLiteral(1),
              numericLiteral(2),
            ])
          ),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle array destructuring with nested arrays`, () => {
    const given = getProgramNode(`
    const [foo, [bar,baz]] = fizz;
  `);
    const expected: LuaProgram = program([
      nodeGroup([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('table.unpack'), [
                identifier('fizz'),
                numericLiteral(1),
                numericLiteral(1),
              ])
            ),
          ]
        ),
        variableDeclaration(
          [
            variableDeclaratorIdentifier(identifier('bar')),
            variableDeclaratorIdentifier(identifier('baz')),
          ],
          [
            variableDeclaratorValue(
              callExpression(identifier('table.unpack'), [
                callExpression(identifier('table.unpack'), [
                  identifier('fizz'),
                  numericLiteral(2),
                  numericLiteral(2),
                ]),
                numericLiteral(1),
                numericLiteral(2),
              ])
            ),
          ]
        ),
      ]),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle array destructuring with rest element`, () => {
    const given = getProgramNode(`
    const [foo, ...bar] = baz;
  `);

    const expected: LuaProgram = program([
      nodeGroup([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('table.unpack'), [
                identifier('baz'),
                numericLiteral(1),
                numericLiteral(1),
              ])
            ),
          ]
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('bar'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('table.pack'), [
                callExpression(identifier('table.unpack'), [
                  identifier('baz'),
                  numericLiteral(2),
                ]),
              ])
            ),
          ]
        ),
      ]),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle array destructuring with assignment pattern element`, () => {
    const given = getProgramNode(`
    const [foo, bar=3] = baz;
  `);

    const expected: LuaProgram = program([
      nodeGroup([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('table.unpack'), [
                identifier('baz'),
                numericLiteral(1),
                numericLiteral(1),
              ])
            ),
          ]
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('bar'))],
          [
            variableDeclaratorValue(
              callExpression(
                functionExpression(
                  [],
                  nodeGroup([
                    variableDeclaration(
                      [variableDeclaratorIdentifier(identifier('element'))],
                      [
                        variableDeclaratorValue(
                          callExpression(identifier('table.unpack'), [
                            identifier('baz'),
                            numericLiteral(2),
                            numericLiteral(2),
                          ])
                        ),
                      ]
                    ),
                    ifStatement(
                      ifClause(
                        binaryExpression(
                          identifier('element'),
                          '==',
                          nilLiteral()
                        ),
                        nodeGroup([returnStatement(numericLiteral(3, '3'))])
                      ),
                      undefined,
                      elseClause(
                        nodeGroup([returnStatement(identifier('element'))])
                      )
                    ),
                  ])
                ),
                []
              )
            ),
          ]
        ),
      ]),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle object destructuring`, () => {
    const given = getProgramNode(`
    const {foo, bar} = baz;
  `);

    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('foo')),
          variableDeclaratorIdentifier(identifier('bar')),
        ],
        [
          variableDeclaratorValue(
            memberExpression(identifier('baz'), '.', identifier('foo'))
          ),
          variableDeclaratorValue(
            memberExpression(identifier('baz'), '.', identifier('bar'))
          ),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle object destructuring from a call expression`, () => {
    const given = getProgramNode(`
    const {foo, bar} = baz();
  `);

    const expected: LuaProgram = program([
      nodeGroup([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(identifier('foo')),
            variableDeclaratorIdentifier(identifier('bar')),
          ],
          []
        ),
        blockStatement([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('ref'))],
            [variableDeclaratorValue(callExpression(identifier('baz'), []))]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('foo'), identifier('bar')],
            [
              memberExpression(identifier('ref'), '.', identifier('foo')),
              memberExpression(identifier('ref'), '.', identifier('bar')),
            ]
          ),
        ]),
      ]),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle object destructuring from a member expression`, () => {
    const given = getProgramNode(`
    const {foo, bar} = baz.fuzz;
  `);

    const expected: LuaProgram = program([
      nodeGroup([
        variableDeclaration(
          [
            variableDeclaratorIdentifier(identifier('foo')),
            variableDeclaratorIdentifier(identifier('bar')),
          ],
          []
        ),
        blockStatement([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('ref'))],
            [
              variableDeclaratorValue(
                memberExpression(identifier('baz'), '.', identifier('fuzz'))
              ),
            ]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('foo'), identifier('bar')],
            [
              memberExpression(identifier('ref'), '.', identifier('foo')),
              memberExpression(identifier('ref'), '.', identifier('bar')),
            ]
          ),
        ]),
      ]),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle object destructuring with aliases`, () => {
    const given = getProgramNode(`
    const {foo:fun, bar:bat} = baz;
  `);

    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('fun')),
          variableDeclaratorIdentifier(identifier('bat')),
        ],
        [
          variableDeclaratorValue(
            memberExpression(identifier('baz'), '.', identifier('foo'))
          ),
          variableDeclaratorValue(
            memberExpression(identifier('baz'), '.', identifier('bar'))
          ),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle object destructuring with rest element`, () => {
    const given = getProgramNode(`
    const {foo, ...bar} = baz;
  `);

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
        [variableDeclaratorIdentifier(identifier('Object'))],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('LuauPolyfill'),
              '.',
              identifier('Object')
            )
          ),
        ]
      ),
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('foo')),
          variableDeclaratorIdentifier(identifier('bar')),
        ],
        [
          variableDeclaratorValue(
            memberExpression(identifier('baz'), '.', identifier('foo'))
          ),
          variableDeclaratorValue(
            callExpression(
              memberExpression(identifier('Object'), '.', identifier('assign')),
              [
                tableConstructor(),
                identifier('baz'),
                tableConstructor([
                  tableNameKeyField(
                    identifier('foo'),
                    memberExpression(
                      identifier('Object'),
                      '.',
                      identifier('None')
                    )
                  ),
                ]),
              ]
            )
          ),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle object destructuring with nested object pattern`, () => {
    const given = getProgramNode(`
    const {foo:{bar,baz}} = fizz;
  `);

    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('bar')),
          variableDeclaratorIdentifier(identifier('baz')),
        ],
        [
          variableDeclaratorValue(
            memberExpression(
              memberExpression(identifier('fizz'), '.', identifier('foo')),
              '.',
              identifier('bar')
            )
          ),
          variableDeclaratorValue(
            memberExpression(
              memberExpression(identifier('fizz'), '.', identifier('foo')),
              '.',
              identifier('baz')
            )
          ),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle object destructuring with rest element and aliases`, () => {
    const given = getProgramNode(`
    const { a, b, 'foo-bar': bar, method1, ...rest } = foo;
  `);

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
        [variableDeclaratorIdentifier(identifier('Object'))],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('LuauPolyfill'),
              '.',
              identifier('Object')
            )
          ),
        ]
      ),
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('a')),
          variableDeclaratorIdentifier(identifier('b')),
          variableDeclaratorIdentifier(identifier('bar')),
          variableDeclaratorIdentifier(identifier('method1')),
          variableDeclaratorIdentifier(identifier('rest')),
        ],
        [
          variableDeclaratorValue(
            memberExpression(identifier('foo'), '.', identifier('a'))
          ),
          variableDeclaratorValue(
            memberExpression(identifier('foo'), '.', identifier('b'))
          ),
          variableDeclaratorValue(
            indexExpression(identifier('foo'), stringLiteral('foo-bar'))
          ),
          variableDeclaratorValue(
            memberExpression(identifier('foo'), '.', identifier('method1'))
          ),
          variableDeclaratorValue(
            callExpression(
              memberExpression(identifier('Object'), '.', identifier('assign')),
              [
                tableConstructor(),
                identifier('foo'),
                tableConstructor([
                  tableNameKeyField(
                    identifier('a'),
                    memberExpression(
                      identifier('Object'),
                      '.',
                      identifier('None')
                    )
                  ),
                  tableNameKeyField(
                    identifier('b'),
                    memberExpression(
                      identifier('Object'),
                      '.',
                      identifier('None')
                    )
                  ),
                  tableExpressionKeyField(
                    stringLiteral('foo-bar'),
                    memberExpression(
                      identifier('Object'),
                      '.',
                      identifier('None')
                    )
                  ),
                  tableNameKeyField(
                    identifier('method1'),
                    memberExpression(
                      identifier('Object'),
                      '.',
                      identifier('None')
                    )
                  ),
                ]),
              ]
            )
          ),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle object destructuring with rest element, aliases and computed properties`, () => {
    const given = getProgramNode(`
    const { a, b, 'foo-bar': bar, method1, [bar]: computed, ...rest } = foo;
  `);

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
        [variableDeclaratorIdentifier(identifier('Object'))],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('LuauPolyfill'),
              '.',
              identifier('Object')
            )
          ),
        ]
      ),
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('a')),
          variableDeclaratorIdentifier(identifier('b')),
          variableDeclaratorIdentifier(identifier('bar')),
          variableDeclaratorIdentifier(identifier('method1')),
          variableDeclaratorIdentifier(identifier('computed')),
          variableDeclaratorIdentifier(identifier('rest')),
        ],
        [
          variableDeclaratorValue(
            memberExpression(identifier('foo'), '.', identifier('a'))
          ),
          variableDeclaratorValue(
            memberExpression(identifier('foo'), '.', identifier('b'))
          ),
          variableDeclaratorValue(
            indexExpression(identifier('foo'), stringLiteral('foo-bar'))
          ),
          variableDeclaratorValue(
            memberExpression(identifier('foo'), '.', identifier('method1'))
          ),
          variableDeclaratorValue(
            indexExpression(identifier('foo'), identifier('bar'))
          ),
          variableDeclaratorValue(
            callExpression(
              memberExpression(identifier('Object'), '.', identifier('assign')),
              [
                tableConstructor(),
                identifier('foo'),
                tableConstructor([
                  tableNameKeyField(
                    identifier('a'),
                    memberExpression(
                      identifier('Object'),
                      '.',
                      identifier('None')
                    )
                  ),
                  tableNameKeyField(
                    identifier('b'),
                    memberExpression(
                      identifier('Object'),
                      '.',
                      identifier('None')
                    )
                  ),
                  tableExpressionKeyField(
                    stringLiteral('foo-bar'),
                    memberExpression(
                      identifier('Object'),
                      '.',
                      identifier('None')
                    )
                  ),
                  tableNameKeyField(
                    identifier('method1'),
                    memberExpression(
                      identifier('Object'),
                      '.',
                      identifier('None')
                    )
                  ),
                  tableExpressionKeyField(
                    identifier('bar'),
                    memberExpression(
                      identifier('Object'),
                      '.',
                      identifier('None')
                    )
                  ),
                ]),
              ]
            )
          ),
        ]
      ),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it(`should handle object destructuring with assignment pattern property`, () => {
    const given = getProgramNode(`
    const { foo, bar = 3 } = fizz;
  `);

    const expected: LuaProgram = program([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('foo')),
          variableDeclaratorIdentifier(identifier('bar')),
        ],
        [
          variableDeclaratorValue(
            memberExpression(identifier('fizz'), '.', identifier('foo'))
          ),
          variableDeclaratorValue(
            callExpression(
              functionExpression(
                [],
                nodeGroup([
                  ifStatement(
                    ifClause(
                      binaryExpression(
                        memberExpression(
                          identifier('fizz'),
                          '.',
                          identifier('bar')
                        ),
                        '==',
                        nilLiteral()
                      ),
                      nodeGroup([returnStatement(numericLiteral(3, '3'))])
                    ),
                    undefined,
                    elseClause(
                      nodeGroup([
                        returnStatement(
                          memberExpression(
                            identifier('fizz'),
                            '.',
                            identifier('bar')
                          )
                        ),
                      ])
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

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });
});
