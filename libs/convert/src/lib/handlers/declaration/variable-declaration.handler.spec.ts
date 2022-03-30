import {
  arrayPattern,
  assignmentPattern as babelAssignmentPattern,
  callExpression as babelCallExpression,
  identifier as babelIdentifier,
  numericLiteral as babelNumericLiteral,
  objectPattern,
  objectProperty,
  restElement,
  stringLiteral as babelStringLiteral,
  variableDeclaration as babelVariableDeclaration,
  variableDeclarator as babelVariableDeclarator,
} from '@babel/types';
import { forwardHandlerRef, testUtils } from '@js-to-lua/handler-utils';
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
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
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
import { handleObjectField } from '../expression-statement.handler';
import { createVariableDeclarationHandler } from './variable-declaration.handler';

const { mockNodeWithValueHandler } = testUtils;

const source = '';

const handleVariableDeclaration = createVariableDeclarationHandler(
  mockNodeWithValueHandler,
  mockNodeWithValueHandler,
  mockNodeWithValueHandler,
  mockNodeWithValueHandler,
  forwardHandlerRef(() => handleObjectField),
  mockNodeWithValueHandler
);

describe('Variable Declaration', () => {
  it.each(['foo', 'bar', 'baz'])(
    `should return LuaVariableDeclaration Node with declarations`,
    (name) => {
      const given = babelVariableDeclaration('let', [
        babelVariableDeclarator(babelIdentifier(name)),
      ]);

      const expected = variableDeclaration(
        [
          variableDeclaratorIdentifier(
            mockNodeWithValue(babelIdentifier(name))
          ),
        ],
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
      const given = babelVariableDeclaration('let', [
        babelVariableDeclarator(
          babelIdentifier(name),
          babelStringLiteral('abc')
        ),
      ]);

      const expected = variableDeclaration(
        [
          variableDeclaratorIdentifier(
            mockNodeWithValue(babelIdentifier(name))
          ),
        ],
        [variableDeclaratorValue(mockNodeWithValue(babelStringLiteral('abc')))]
      );

      expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
        expected
      );
    }
  );

  it(`should return LuaVariableDeclaration Node with declarations and partial initialization - null in the middle`, () => {
    const given = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        babelIdentifier('foo'),
        babelStringLiteral('foo')
      ),
      babelVariableDeclarator(babelIdentifier('bar')),
      babelVariableDeclarator(
        babelIdentifier('baz'),
        babelStringLiteral('baz')
      ),
    ]);

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(mockNodeWithValue(babelIdentifier('foo'))),
        variableDeclaratorIdentifier(mockNodeWithValue(babelIdentifier('bar'))),
        variableDeclaratorIdentifier(mockNodeWithValue(babelIdentifier('baz'))),
      ],
      [
        variableDeclaratorValue(mockNodeWithValue(babelStringLiteral('foo'))),
        variableDeclaratorValue(null),
        variableDeclaratorValue(mockNodeWithValue(babelStringLiteral('baz'))),
      ]
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should return LuaVariableDeclaration Node with declarations and partial initialization - null at the end`, () => {
    const given = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        babelIdentifier('foo'),
        babelStringLiteral('foo')
      ),
      babelVariableDeclarator(
        babelIdentifier('bar'),
        babelStringLiteral('bar')
      ),
      babelVariableDeclarator(babelIdentifier('baz')),
    ]);

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(mockNodeWithValue(babelIdentifier('foo'))),
        variableDeclaratorIdentifier(mockNodeWithValue(babelIdentifier('bar'))),
        variableDeclaratorIdentifier(mockNodeWithValue(babelIdentifier('baz'))),
      ],
      [
        variableDeclaratorValue(mockNodeWithValue(babelStringLiteral('foo'))),
        variableDeclaratorValue(mockNodeWithValue(babelStringLiteral('bar'))),
      ]
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle array destructuring`, () => {
    const given = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        arrayPattern([babelIdentifier('foo'), babelIdentifier('bar')]),
        babelIdentifier('baz')
      ),
    ]);

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(mockNodeWithValue(babelIdentifier('foo'))),
        variableDeclaratorIdentifier(mockNodeWithValue(babelIdentifier('bar'))),
      ],
      [
        variableDeclaratorValue(
          tableUnpackCall(
            mockNodeWithValue(babelIdentifier('baz')),
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

  it(`should handle array destructuring with nested arrays`, () => {
    const given = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        arrayPattern([
          babelIdentifier('foo'),
          arrayPattern([babelIdentifier('bar'), babelIdentifier('baz')]),
        ]),
        babelIdentifier('fizz')
      ),
    ]);

    const expected = nodeGroup([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(
            mockNodeWithValue(babelIdentifier('foo'))
          ),
        ],
        [
          variableDeclaratorValue(
            tableUnpackCall(
              mockNodeWithValue(babelIdentifier('fizz')),
              numericLiteral(1),
              numericLiteral(1)
            )
          ),
        ]
      ),
      variableDeclaration(
        [
          variableDeclaratorIdentifier(
            mockNodeWithValue(babelIdentifier('bar'))
          ),
          variableDeclaratorIdentifier(
            mockNodeWithValue(babelIdentifier('baz'))
          ),
        ],
        [
          variableDeclaratorValue(
            tableUnpackCall(
              tableUnpackCall(
                mockNodeWithValue(babelIdentifier('fizz')),
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
    const given = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        arrayPattern([
          babelIdentifier('foo'),
          restElement(babelIdentifier('bar')),
        ]),
        babelIdentifier('baz')
      ),
    ]);

    const expected = nodeGroup([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(
            mockNodeWithValue(babelIdentifier('foo'))
          ),
        ],
        [
          variableDeclaratorValue(
            tableUnpackCall(
              mockNodeWithValue(babelIdentifier('baz')),
              numericLiteral(1),
              numericLiteral(1)
            )
          ),
        ]
      ),
      variableDeclaration(
        [
          variableDeclaratorIdentifier(
            mockNodeWithValue(babelIdentifier('bar'))
          ),
        ],
        [
          variableDeclaratorValue(
            tablePackCall(
              tableUnpackCall(
                mockNodeWithValue(babelIdentifier('baz')),
                numericLiteral(2)
              )
            )
          ),
        ]
      ),
    ]);

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle array destructuring with assignment pattern element`, () => {
    const given = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        arrayPattern([
          babelIdentifier('foo'),
          babelAssignmentPattern(
            babelIdentifier('bar'),
            babelNumericLiteral(3)
          ),
        ]),
        babelIdentifier('baz')
      ),
    ]);

    const expected = nodeGroup([
      variableDeclaration(
        [
          variableDeclaratorIdentifier(
            mockNodeWithValue(babelIdentifier('foo'))
          ),
        ],
        [
          variableDeclaratorValue(
            tableUnpackCall(
              mockNodeWithValue(babelIdentifier('baz')),
              numericLiteral(1),
              numericLiteral(1)
            )
          ),
        ]
      ),
      variableDeclaration(
        [
          variableDeclaratorIdentifier(
            mockNodeWithValue(babelIdentifier('bar'))
          ),
        ],
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
                          mockNodeWithValue(babelIdentifier('baz')),
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
                          mockNodeWithValue(babelNumericLiteral(3))
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
    const given = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        objectPattern([
          objectProperty(babelIdentifier('foo'), babelIdentifier('foo')),
          objectProperty(babelIdentifier('bar'), babelIdentifier('bar')),
        ]),
        babelIdentifier('baz')
      ),
    ]);

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(identifier('foo')),
        variableDeclaratorIdentifier(identifier('bar')),
      ],
      [
        variableDeclaratorValue(
          memberExpression(
            mockNodeWithValue(babelIdentifier('baz')),
            '.',
            identifier('foo')
          )
        ),
        variableDeclaratorValue(
          memberExpression(
            mockNodeWithValue(babelIdentifier('baz')),
            '.',
            identifier('bar')
          )
        ),
      ]
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle object destructuring with aliases`, () => {
    const given = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        objectPattern([
          objectProperty(babelIdentifier('foo'), babelIdentifier('fun')),
          objectProperty(babelIdentifier('bar'), babelIdentifier('bat')),
        ]),
        babelIdentifier('baz')
      ),
    ]);

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(identifier('fun')),
        variableDeclaratorIdentifier(identifier('bat')),
      ],
      [
        variableDeclaratorValue(
          memberExpression(
            mockNodeWithValue(babelIdentifier('baz')),
            '.',
            identifier('foo')
          )
        ),
        variableDeclaratorValue(
          memberExpression(
            mockNodeWithValue(babelIdentifier('baz')),
            '.',
            identifier('bar')
          )
        ),
      ]
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle object destructuring with rest element`, () => {
    const given = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        objectPattern([
          objectProperty(babelIdentifier('foo'), babelIdentifier('foo')),
          restElement(babelIdentifier('bar')),
        ]),
        babelIdentifier('baz')
      ),
    ]);

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(identifier('foo')),
        variableDeclaratorIdentifier(mockNodeWithValue(babelIdentifier('bar'))),
      ],
      [
        variableDeclaratorValue(
          memberExpression(
            mockNodeWithValue(babelIdentifier('baz')),
            '.',
            identifier('foo')
          )
        ),
        variableDeclaratorValue(
          callExpression(objectAssign(), [
            tableConstructor(),
            mockNodeWithValue(babelIdentifier('baz')),
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
    const given = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        objectPattern([
          objectProperty(
            babelIdentifier('foo'),
            objectPattern([
              objectProperty(babelIdentifier('bar'), babelIdentifier('bar')),
              objectProperty(babelIdentifier('baz'), babelIdentifier('baz')),
            ])
          ),
        ]),
        babelIdentifier('fizz')
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
            memberExpression(
              mockNodeWithValue(babelIdentifier('fizz')),
              '.',
              identifier('foo')
            ),
            '.',
            identifier('bar')
          )
        ),
        variableDeclaratorValue(
          memberExpression(
            memberExpression(
              mockNodeWithValue(babelIdentifier('fizz')),
              '.',
              identifier('foo')
            ),
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
    const given = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        objectPattern([
          objectProperty(babelIdentifier('foo'), babelIdentifier('foo')),
          objectProperty(
            babelIdentifier('bar'),
            babelAssignmentPattern(
              babelIdentifier('bar'),
              babelNumericLiteral(3)
            )
          ),
        ]),
        babelIdentifier('fizz')
      ),
    ]);

    const expected = variableDeclaration(
      [
        variableDeclaratorIdentifier(identifier('foo')),
        variableDeclaratorIdentifier(identifier('bar')),
      ],
      [
        variableDeclaratorValue(
          memberExpression(
            mockNodeWithValue(babelIdentifier('fizz')),
            '.',
            identifier('foo')
          )
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
                        mockNodeWithValue(babelIdentifier('fizz')),
                        '.',
                        identifier('bar')
                      ),
                      '==',
                      nilLiteral()
                    ),
                    nodeGroup([
                      returnStatement(
                        mockNodeWithValue(babelNumericLiteral(3))
                      ),
                    ])
                  ),
                  undefined,
                  elseClause(
                    nodeGroup([
                      returnStatement(
                        memberExpression(
                          mockNodeWithValue(babelIdentifier('fizz')),
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
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle object destructuring of call expression with single identifier`, () => {
    const given = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        objectPattern([
          objectProperty(babelIdentifier('foo'), babelIdentifier('foo')),
        ]),
        babelCallExpression(babelIdentifier('baz'), [])
      ),
    ]);

    const expected = variableDeclaration(
      [variableDeclaratorIdentifier(identifier('foo'))],
      [
        variableDeclaratorValue(
          memberExpression(
            mockNodeWithValue(babelCallExpression(babelIdentifier('baz'), [])),
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
    const given = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        objectPattern([
          objectProperty(babelIdentifier('foo'), babelIdentifier('foo')),
          objectProperty(babelIdentifier('bar'), babelIdentifier('bar')),
        ]),
        babelCallExpression(babelIdentifier('baz'), [])
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
              mockNodeWithValue(babelCallExpression(babelIdentifier('baz'), []))
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
});
