import {
  arrayPattern,
  assignmentPattern as babelAssignmentPattern,
  identifier as babelIdentifier,
  numericLiteral as babelNumericLiteral,
  objectPattern,
  objectProperty,
  restElement,
  stringLiteral as babelStringLiteral,
  variableDeclaration as babelVariableDeclaration,
  VariableDeclaration,
  variableDeclarator as babelVariableDeclarator,
} from '@babel/types';
import { objectAssign, objectNone } from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  callExpression,
  elseClause,
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
  LuaNodeGroup,
  LuaVariableDeclaration,
  memberExpression,
  nilLiteral,
  nodeGroup,
  numericLiteral,
  returnStatement,
  stringLiteral,
  tableConstructor,
  tableNameKeyField,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { forwardHandlerRef } from '../../utils/forward-handler-ref';
import {
  handleExpression,
  handleExpressionAsStatement,
  handleObjectField,
  handleObjectKeyExpression,
  handleObjectPropertyIdentifier,
  handleObjectPropertyValue,
  handleStatement,
} from '../expression-statement.handler';
import { createIdentifierHandler } from '../expression/identifier.handler';
import { createLValHandler } from '../l-val.handler';
import { createTypeAnnotationHandler } from '../type/type-annotation.handler';
import { createDeclarationHandler } from './declaration.handler';
import { createVariableDeclarationHandler } from './variable-declaration.handler';

const source = '';

const { typesHandler, handleTsTypes } = createTypeAnnotationHandler(
  forwardHandlerRef(() => handleExpression),
  forwardHandlerRef(() => handleIdentifier)
);

const handleIdentifier = createIdentifierHandler(typesHandler);

const handleLVal = createLValHandler(
  forwardHandlerRef(() => handleIdentifier),
  forwardHandlerRef(() => handleExpression)
);

const handleDeclaration = createDeclarationHandler(
  forwardHandlerRef(() => handleExpression),
  forwardHandlerRef(() => handleExpressionAsStatement),
  forwardHandlerRef(() => handleIdentifier),
  forwardHandlerRef(() => handleStatement),
  forwardHandlerRef(() => handleObjectField),
  handleTsTypes,
  forwardHandlerRef(() => handleObjectPropertyIdentifier),
  forwardHandlerRef(() => handleObjectKeyExpression),
  forwardHandlerRef(() => handleObjectPropertyValue),
  forwardHandlerRef(() => handleLVal)
);

const handleVariableDeclaration = createVariableDeclarationHandler(
  forwardHandlerRef(() => handleExpression),
  forwardHandlerRef(() => handleExpressionAsStatement),
  forwardHandlerRef(() => handleIdentifier),
  forwardHandlerRef(() => handleStatement),
  forwardHandlerRef(() => handleObjectField),
  forwardHandlerRef(() => handleDeclaration)
);

describe('Variable Declaration', () => {
  ['foo', 'bar', 'baz'].forEach((name) => {
    it(`should return LuaVariableDeclaration Node with declarations`, () => {
      const given: VariableDeclaration = babelVariableDeclaration('let', [
        babelVariableDeclarator(babelIdentifier(name)),
      ]);

      const expected: LuaVariableDeclaration = variableDeclaration(
        [variableDeclaratorIdentifier(identifier(name))],
        []
      );

      expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
        expected
      );
    });
  });

  ['foo', 'bar', 'baz'].forEach((name) => {
    it(`should return LuaVariableDeclaration Node with declarations and initialization`, () => {
      const given: VariableDeclaration = babelVariableDeclaration('let', [
        babelVariableDeclarator(
          babelIdentifier(name),
          babelStringLiteral('abc')
        ),
      ]);

      const expected: LuaVariableDeclaration = variableDeclaration(
        [variableDeclaratorIdentifier(identifier(name))],
        [variableDeclaratorValue(stringLiteral('abc'))]
      );

      expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
        expected
      );
    });
  });

  it(`should return LuaVariableDeclaration Node with declarations and partial initialization - null in the middle`, () => {
    const given: VariableDeclaration = babelVariableDeclaration('let', [
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

    const expected: LuaVariableDeclaration = variableDeclaration(
      [
        variableDeclaratorIdentifier(identifier('foo')),
        variableDeclaratorIdentifier(identifier('bar')),
        variableDeclaratorIdentifier(identifier('baz')),
      ],
      [
        variableDeclaratorValue(stringLiteral('foo')),
        variableDeclaratorValue(null),
        variableDeclaratorValue(stringLiteral('baz')),
      ]
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should return LuaVariableDeclaration Node with declarations and partial initialization - null at the end`, () => {
    const given: VariableDeclaration = babelVariableDeclaration('let', [
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

    const expected: LuaVariableDeclaration = variableDeclaration(
      [
        variableDeclaratorIdentifier(identifier('foo')),
        variableDeclaratorIdentifier(identifier('bar')),
        variableDeclaratorIdentifier(identifier('baz')),
      ],
      [
        variableDeclaratorValue(stringLiteral('foo')),
        variableDeclaratorValue(stringLiteral('bar')),
      ]
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle array destructuring`, () => {
    const given: VariableDeclaration = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        arrayPattern([babelIdentifier('foo'), babelIdentifier('bar')]),
        babelIdentifier('baz')
      ),
    ]);

    const expected: LuaVariableDeclaration = variableDeclaration(
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
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle array destructuring with nested arrays`, () => {
    const given: VariableDeclaration = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        arrayPattern([
          babelIdentifier('foo'),
          arrayPattern([babelIdentifier('bar'), babelIdentifier('baz')]),
        ]),
        babelIdentifier('fizz')
      ),
    ]);

    const expected: LuaNodeGroup = nodeGroup([
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
    ]);

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle array destructuring with rest element`, () => {
    const given: VariableDeclaration = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        arrayPattern([
          babelIdentifier('foo'),
          restElement(babelIdentifier('bar')),
        ]),
        babelIdentifier('baz')
      ),
    ]);

    const expected: LuaNodeGroup = nodeGroup([
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
    ]);

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });

  it(`should handle array destructuring with assignment pattern element`, () => {
    const given: VariableDeclaration = babelVariableDeclaration('let', [
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

    const expected: LuaNodeGroup = nodeGroup([
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
                      nodeGroup([returnStatement(numericLiteral(3))])
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
    const given: VariableDeclaration = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        objectPattern([
          objectProperty(babelIdentifier('foo'), babelIdentifier('foo')),
          objectProperty(babelIdentifier('bar'), babelIdentifier('bar')),
        ]),
        babelIdentifier('baz')
      ),
    ]);

    const expected: LuaVariableDeclaration = variableDeclaration(
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
    const given: VariableDeclaration = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        objectPattern([
          objectProperty(babelIdentifier('foo'), babelIdentifier('fun')),
          objectProperty(babelIdentifier('bar'), babelIdentifier('bat')),
        ]),
        babelIdentifier('baz')
      ),
    ]);

    const expected: LuaVariableDeclaration = variableDeclaration(
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
    const given: VariableDeclaration = babelVariableDeclaration('let', [
      babelVariableDeclarator(
        objectPattern([
          objectProperty(babelIdentifier('foo'), babelIdentifier('foo')),
          restElement(babelIdentifier('bar')),
        ]),
        babelIdentifier('baz')
      ),
    ]);

    const expected: LuaVariableDeclaration = variableDeclaration(
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
    const given: VariableDeclaration = babelVariableDeclaration('let', [
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

    const expected: LuaVariableDeclaration = variableDeclaration(
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
    const given: VariableDeclaration = babelVariableDeclaration('let', [
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

    const expected: LuaVariableDeclaration = variableDeclaration(
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
                    nodeGroup([returnStatement(numericLiteral(3))])
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
    );

    expect(handleVariableDeclaration.handler(source, {}, given)).toEqual(
      expected
    );
  });
});
