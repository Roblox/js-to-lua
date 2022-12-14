import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  forwardHandlerRef,
  testUtils,
} from '@js-to-lua/handler-utils';
import {
  objectAssign,
  objectNone,
  tablePackCall,
  tableUnpackCall,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  blockStatement,
  callExpression,
  elseClause,
  elseExpressionClause,
  functionDeclaration,
  functionExpression,
  identifier,
  ifClause,
  ifElseExpression,
  ifExpressionClause,
  ifStatement,
  indexExpression,
  LuaExpression,
  memberExpression,
  nilLiteral,
  nodeGroup,
  numericLiteral,
  returnStatement,
  tableConstructor,
  tableNameKeyField,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { objectFieldHandler } from '../expression-statement.handler';
import {
  IdentifierHandlerFrom,
  IdentifierHandlerTo,
  IdentifierStrictHandlerFrom,
  IdentifierStrictHandlerTo,
} from '../expression/identifier-handler-types';
import { createVariableDeclarationHandler } from './variable-declaration.handler';

const { mockNodeWithValueHandler, mockNodeAsStatementWithValueHandler } =
  testUtils;

const source = '';

const handleVariableDeclaration = createVariableDeclarationHandler(
  createHandlerFunction<LuaExpression, Babel.Expression>(
    (source, config, node) =>
      Babel.isIdentifier(node)
        ? identifier(node.name)
        : mockNodeWithValueHandler(source, config, node)
  ),
  mockNodeAsStatementWithValueHandler,
  createHandlerFunction<IdentifierHandlerTo, IdentifierHandlerFrom>(
    (source, config, node) => identifier(node.name)
  ),
  createHandlerFunction<IdentifierStrictHandlerTo, IdentifierStrictHandlerFrom>(
    (source, config, node) => identifier(node.name)
  ),
  mockNodeWithValueHandler,
  forwardHandlerRef(() => objectFieldHandler),
  mockNodeWithValueHandler
);

describe('Variable Declaration', () => {
  it.each(['foo', 'bar', 'baz'])(
    `should return LuaVariableDeclaration Node with declarations`,
    (name) => {
      const given = Babel.variableDeclaration('let', [
        Babel.variableDeclarator(Babel.identifier(name)),
      ]);

      const expected = variableDeclaration(
        [variableDeclaratorIdentifier(identifier(name))],
        []
      );

      expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
        expected
      );
    }
  );

  it.each(['foo', 'bar', 'baz'])(
    `should return LuaVariableDeclaration Node with declarations and initialization`,
    (name) => {
      const given = Babel.variableDeclaration('let', [
        Babel.variableDeclarator(
          Babel.identifier(name),
          Babel.stringLiteral('abc')
        ),
      ]);

      const expected = variableDeclaration(
        [variableDeclaratorIdentifier(identifier(name))],
        [variableDeclaratorValue(mockNodeWithValue(Babel.stringLiteral('abc')))]
      );

      expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
        expected
      );
    }
  );

  it(`should return LuaVariableDeclaration Node with declarations and partial initialization - null in the middle`, () => {
    const given = Babel.variableDeclaration('let', [
      Babel.variableDeclarator(
        Babel.identifier('foo'),
        Babel.stringLiteral('foo')
      ),
      Babel.variableDeclarator(Babel.identifier('bar')),
      Babel.variableDeclarator(
        Babel.identifier('baz'),
        Babel.stringLiteral('baz')
      ),
    ]);

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(identifier('foo')),
        variableDeclaratorIdentifier(identifier('bar')),
        variableDeclaratorIdentifier(identifier('baz')),
      ],
      [
        variableDeclaratorValue(mockNodeWithValue(Babel.stringLiteral('foo'))),
        variableDeclaratorValue(null),
        variableDeclaratorValue(mockNodeWithValue(Babel.stringLiteral('baz'))),
      ]
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should return LuaVariableDeclaration Node with declarations and partial initialization - null at the end`, () => {
    const given = Babel.variableDeclaration('let', [
      Babel.variableDeclarator(
        Babel.identifier('foo'),
        Babel.stringLiteral('foo')
      ),
      Babel.variableDeclarator(
        Babel.identifier('bar'),
        Babel.stringLiteral('bar')
      ),
      Babel.variableDeclarator(Babel.identifier('baz')),
    ]);

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(identifier('foo')),
        variableDeclaratorIdentifier(identifier('bar')),
        variableDeclaratorIdentifier(identifier('baz')),
      ],
      [
        variableDeclaratorValue(mockNodeWithValue(Babel.stringLiteral('foo'))),
        variableDeclaratorValue(mockNodeWithValue(Babel.stringLiteral('bar'))),
      ]
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle array destructuring`, () => {
    const given = Babel.variableDeclaration('let', [
      Babel.variableDeclarator(
        Babel.arrayPattern([Babel.identifier('foo'), Babel.identifier('bar')]),
        Babel.identifier('baz')
      ),
    ]);

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(identifier('foo')),
        variableDeclaratorIdentifier(identifier('bar')),
      ],
      [
        variableDeclaratorValue(
          tableUnpackCall(
            identifier('baz'),
            numericLiteral(1),
            numericLiteral(2)
          )
        ),
      ]
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle array destructuring with missing values`, () => {
    const given = Babel.variableDeclaration('let', [
      Babel.variableDeclarator(
        Babel.arrayPattern([null, Babel.identifier('bar')]),
        Babel.identifier('baz')
      ),
    ]);

    const expected = variableDeclaration(
      [variableDeclaratorIdentifier(identifier('bar'))],
      [
        variableDeclaratorValue(
          indexExpression(identifier('baz'), numericLiteral(2))
        ),
      ]
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle array destructuring with large missing values`, () => {
    const given = Babel.variableDeclaration('let', [
      Babel.variableDeclarator(
        Babel.arrayPattern([
          null,
          Babel.identifier('a'),
          null,
          null,
          Babel.identifier('b'),
          Babel.identifier('c'),
          null,
          Babel.identifier('e'),
        ]),
        Babel.identifier('values')
      ),
    ]);

    const expected = nodeGroup([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('a'))],
        [
          variableDeclaratorValue(
            indexExpression(identifier('values'), numericLiteral(2))
          ),
        ]
      ),
      variableDeclaration(
        [
          variableDeclaratorIdentifier(identifier('b')),
          variableDeclaratorIdentifier(identifier('c')),
        ],
        [
          variableDeclaratorValue(
            tableUnpackCall(
              identifier('values'),
              numericLiteral(5),
              numericLiteral(6)
            )
          ),
        ]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('e'))],
        [
          variableDeclaratorValue(
            indexExpression(identifier('values'), numericLiteral(8))
          ),
        ]
      ),
    ]);

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });
  it(`should handle array destructuring with nested arrays`, () => {
    const given = Babel.variableDeclaration('let', [
      Babel.variableDeclarator(
        Babel.arrayPattern([
          Babel.identifier('foo'),
          Babel.arrayPattern([
            Babel.identifier('bar'),
            Babel.identifier('baz'),
          ]),
        ]),
        Babel.identifier('fizz')
      ),
    ]);

    const expected = nodeGroup([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [
          variableDeclaratorValue(
            indexExpression(identifier('fizz'), numericLiteral(1))
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
            tableUnpackCall(
              tableUnpackCall(
                identifier('fizz'),
                numericLiteral(2),
                numericLiteral(2)
              ),
              numericLiteral(1),
              numericLiteral(2)
            )
          ),
        ]
      ),
    ]);

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle array destructuring with rest element`, () => {
    const given = Babel.variableDeclaration('let', [
      Babel.variableDeclarator(
        Babel.arrayPattern([
          Babel.identifier('foo'),
          Babel.restElement(Babel.identifier('bar')),
        ]),
        Babel.identifier('baz')
      ),
    ]);

    const expected = nodeGroup([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [
          variableDeclaratorValue(
            indexExpression(identifier('baz'), numericLiteral(1))
          ),
        ]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('bar'))],
        [
          variableDeclaratorValue(
            tablePackCall(tableUnpackCall(identifier('baz'), numericLiteral(2)))
          ),
        ]
      ),
    ]);

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle array destructuring with assignment pattern element`, () => {
    const given = Babel.variableDeclaration('let', [
      Babel.variableDeclarator(
        Babel.arrayPattern([
          Babel.identifier('foo'),
          Babel.assignmentPattern(
            Babel.identifier('bar'),
            Babel.numericLiteral(3)
          ),
        ]),
        Babel.identifier('baz')
      ),
    ]);

    const expected = nodeGroup([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [
          variableDeclaratorValue(
            indexExpression(identifier('baz'), numericLiteral(1))
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
                        tableUnpackCall(
                          identifier('baz'),
                          numericLiteral(2),
                          numericLiteral(2)
                        )
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
                      nodeGroup([
                        returnStatement(
                          mockNodeWithValue(Babel.numericLiteral(3))
                        ),
                      ])
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
    ]);

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle object destructuring`, () => {
    const given = Babel.variableDeclaration('let', [
      Babel.variableDeclarator(
        Babel.objectPattern([
          Babel.objectProperty(
            Babel.identifier('foo'),
            Babel.identifier('foo')
          ),
          Babel.objectProperty(
            Babel.identifier('bar'),
            Babel.identifier('bar')
          ),
        ]),
        Babel.identifier('baz')
      ),
    ]);

    const expected = variableDeclaration(
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
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle object destructuring with aliases`, () => {
    const given = Babel.variableDeclaration('let', [
      Babel.variableDeclarator(
        Babel.objectPattern([
          Babel.objectProperty(
            Babel.identifier('foo'),
            Babel.identifier('fun')
          ),
          Babel.objectProperty(
            Babel.identifier('bar'),
            Babel.identifier('bat')
          ),
        ]),
        Babel.identifier('baz')
      ),
    ]);

    const expected = variableDeclaration(
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
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle object destructuring with rest element`, () => {
    const given = Babel.variableDeclaration('let', [
      Babel.variableDeclarator(
        Babel.objectPattern([
          Babel.objectProperty(
            Babel.identifier('foo'),
            Babel.identifier('foo')
          ),
          Babel.restElement(Babel.identifier('bar')),
        ]),
        Babel.identifier('baz')
      ),
    ]);

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(identifier('foo')),
        variableDeclaratorIdentifier(identifier('bar')),
      ],
      [
        variableDeclaratorValue(
          memberExpression(identifier('baz'), '.', identifier('foo'))
        ),
        variableDeclaratorValue(
          callExpression(objectAssign(), [
            tableConstructor(),
            identifier('baz'),
            tableConstructor([
              tableNameKeyField(identifier('foo'), objectNone()),
            ]),
          ])
        ),
      ]
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle object destructuring with nested object pattern`, () => {
    const given = Babel.variableDeclaration('let', [
      Babel.variableDeclarator(
        Babel.objectPattern([
          Babel.objectProperty(
            Babel.identifier('foo'),
            Babel.objectPattern([
              Babel.objectProperty(
                Babel.identifier('bar'),
                Babel.identifier('bar')
              ),
              Babel.objectProperty(
                Babel.identifier('baz'),
                Babel.identifier('baz')
              ),
            ])
          ),
        ]),
        Babel.identifier('fizz')
      ),
    ]);

    const expected = variableDeclaration(
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
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle object destructuring with assignment pattern property`, () => {
    const given = Babel.variableDeclaration('let', [
      Babel.variableDeclarator(
        Babel.objectPattern([
          Babel.objectProperty(
            Babel.identifier('foo'),
            Babel.identifier('foo')
          ),
          Babel.objectProperty(
            Babel.identifier('bar'),
            Babel.assignmentPattern(
              Babel.identifier('bar'),
              Babel.numericLiteral(3)
            )
          ),
        ]),
        Babel.identifier('fizz')
      ),
    ]);

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(identifier('foo')),
        variableDeclaratorIdentifier(identifier('bar')),
      ],
      [
        variableDeclaratorValue(
          memberExpression(identifier('fizz'), '.', identifier('foo'))
        ),
        variableDeclaratorValue(
          ifElseExpression(
            ifExpressionClause(
              binaryExpression(
                memberExpression(identifier('fizz'), '.', identifier('bar')),
                '==',
                nilLiteral()
              ),

              mockNodeWithValue(Babel.numericLiteral(3))
            ),
            elseExpressionClause(
              memberExpression(identifier('fizz'), '.', identifier('bar'))
            )
          )
        ),
      ]
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle object destructuring of call expression with single identifier`, () => {
    const given = Babel.variableDeclaration('let', [
      Babel.variableDeclarator(
        Babel.objectPattern([
          Babel.objectProperty(
            Babel.identifier('foo'),
            Babel.identifier('foo')
          ),
        ]),
        Babel.callExpression(Babel.identifier('baz'), [])
      ),
    ]);

    const expected = variableDeclaration(
      [variableDeclaratorIdentifier(identifier('foo'))],
      [
        variableDeclaratorValue(
          memberExpression(
            mockNodeWithValue(
              Babel.callExpression(Babel.identifier('baz'), [])
            ),
            '.',
            identifier('foo')
          )
        ),
      ]
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle object destructuring of call expression with multiple identifiers`, () => {
    const given = Babel.variableDeclaration('let', [
      Babel.variableDeclarator(
        Babel.objectPattern([
          Babel.objectProperty(
            Babel.identifier('foo'),
            Babel.identifier('foo')
          ),
          Babel.objectProperty(
            Babel.identifier('bar'),
            Babel.identifier('bar')
          ),
        ]),
        Babel.callExpression(Babel.identifier('baz'), [])
      ),
    ]);

    const expected = nodeGroup([
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
              mockNodeWithValue(
                Babel.callExpression(Babel.identifier('baz'), [])
              )
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
    ]);

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle named function expression with same name as declared variable`, () => {
    const given = Babel.variableDeclaration('let', [
      Babel.variableDeclarator(
        Babel.identifier('foo'),
        Babel.functionExpression(
          Babel.identifier('foo'),
          [],
          Babel.blockStatement([])
        )
      ),
    ]);

    const expected = functionDeclaration(identifier('foo'));

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle named function expression with different name as declared variable`, () => {
    const given = Babel.variableDeclaration('let', [
      Babel.variableDeclarator(
        Babel.identifier('foo'),
        Babel.functionExpression(
          Babel.identifier('bar'),
          [],
          Babel.blockStatement([])
        )
      ),
    ]);

    const expected = nodeGroup([
      functionDeclaration(identifier('bar')),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [variableDeclaratorValue(identifier('bar'))]
      ),
    ]);

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });
});
