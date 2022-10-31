import * as Babel from '@babel/types';
import {
  selfIdentifier,
  withClassDeclarationExtra,
  withLeadingComments,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  callExpression,
  commentLine,
  elseExpressionClause,
  expressionStatement,
  functionDeclaration,
  functionDeclarationMultipleReturn,
  functionParamName,
  functionReturnType,
  identifier,
  ifElseExpression,
  ifExpressionClause,
  memberExpression,
  nilLiteral,
  nodeGroup,
  returnStatement,
  stringLiteral,
  tableConstructor,
  tableNameKeyField,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeCastExpression,
  typeFunction,
  typeIntersection,
  typeLiteral,
  typeNumber,
  typeOptional,
  typeParameterDeclaration,
  typePropertySignature,
  typeReference,
  typeString,
  typeUnion,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { statementHandler } from '../../expression-statement.handler';

const source = '';

describe('Class Declaration', () => {
  describe('Base Class', () => {
    const baseClassDefaultExpectedNodes = [
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('BaseClass'))],
        [
          variableDeclaratorValue(
            typeCastExpression(
              tableConstructor(),
              typeIntersection([
                typeReference(identifier('BaseClass')),
                typeReference(identifier('BaseClass_statics')),
              ])
            )
          ),
        ]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [
          memberExpression(
            typeCastExpression(identifier('BaseClass'), typeAny()),
            '.',
            identifier('__index')
          ),
        ],
        [identifier('BaseClass')]
      ),
    ] as const;
    const baseClassPrivateExpectedNodes = [
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('BaseClass'))],
        [
          variableDeclaratorValue(
            typeCastExpression(
              tableConstructor(),
              typeIntersection([
                typeReference(identifier('BaseClass')),
                typeReference(identifier('BaseClass_statics')),
              ])
            )
          ),
        ]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('BaseClass_private'))],
        [
          variableDeclaratorValue(
            typeCastExpression(
              identifier('BaseClass'),
              typeIntersection([
                typeReference(identifier('BaseClass_private')),
                typeReference(identifier('BaseClass_statics')),
              ])
            )
          ),
        ]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [
          memberExpression(
            typeCastExpression(identifier('BaseClass'), typeAny()),
            '.',
            identifier('__index')
          ),
        ],
        [identifier('BaseClass')]
      ),
    ] as const;

    const baseClassGenericExpectedNodes = [
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('BaseClass'))],
        [
          variableDeclaratorValue(
            typeCastExpression(
              tableConstructor(),
              typeIntersection([
                typeReference(identifier('BaseClass'), [typeAny()]),
                typeReference(identifier('BaseClass_statics')),
              ])
            )
          ),
        ]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [
          memberExpression(
            typeCastExpression(identifier('BaseClass'), typeAny()),
            '.',
            identifier('__index')
          ),
        ],
        [identifier('BaseClass')]
      ),
    ] as const;

    it('should convert class', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('BaseClass'),
        null,
        Babel.classBody([])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('BaseClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'))
                )
              ),
            ]),
            typeReference(identifier('BaseClass')),
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert generic class with empty generic type params', () => {
      const given = {
        ...Babel.classDeclaration(
          Babel.identifier('BaseClass'),
          null,
          Babel.classBody([])
        ),
        typeParameters: Babel.tSTypeParameterDeclaration([]),
      };

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('BaseClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'))
                )
              ),
            ]),
            typeReference(identifier('BaseClass')),
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert generic class with generic type params', () => {
      const given = {
        ...Babel.classDeclaration(
          Babel.identifier('BaseClass'),
          null,
          Babel.classBody([])
        ),
        typeParameters: Babel.tSTypeParameterDeclaration([
          Babel.tsTypeParameter(null, null, 'T'),
        ]),
      };

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('BaseClass'),
            typeLiteral([]),
            typeParameterDeclaration([typeReference(identifier('T'))])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('BaseClass'), [
                          typeReference(identifier('T')),
                        ]),
                      ]),
                      typeParameterDeclaration([typeReference(identifier('T'))])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassGenericExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'), [
                    typeReference(identifier('T')),
                  ])
                )
              ),
            ]),
            typeReference(identifier('BaseClass'), [
              typeReference(identifier('T')),
            ]),
            false,
            typeParameterDeclaration([typeReference(identifier('T'))])
          ),
        ])
      );

      const actual = statementHandler.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should convert generic class with generic type params with default values', () => {
      const given = {
        ...Babel.classDeclaration(
          Babel.identifier('BaseClass'),
          null,
          Babel.classBody([])
        ),
        typeParameters: Babel.tSTypeParameterDeclaration([
          Babel.tsTypeParameter(null, Babel.tsStringKeyword(), 'T'),
        ]),
      };

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('BaseClass'),
            typeLiteral([]),
            typeParameterDeclaration([
              typeReference(identifier('T'), undefined, typeString()),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('BaseClass'), [
                          typeReference(identifier('T')),
                        ]),
                      ]),
                      typeParameterDeclaration([
                        typeReference(identifier('T'), undefined, typeString()),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassGenericExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'), [
                    typeReference(identifier('T')),
                  ])
                )
              ),
            ]),
            typeReference(identifier('BaseClass'), [
              typeReference(identifier('T')),
            ]),
            false,
            typeParameterDeclaration([
              typeReference(identifier('T'), undefined, typeString()),
            ])
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert class constructor to <ClassId>.new function', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('BaseClass'),
        null,
        Babel.classBody([
          Babel.classMethod(
            'constructor',
            Babel.identifier('constructor'),
            [],
            Babel.blockStatement([])
          ),
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('BaseClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier('BaseClass.new'),
            [],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'))
                )
              ),
            ]),
            typeReference(identifier('BaseClass')),
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert class methods to <ClassId>:<methodName> function', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('BaseClass'),
        null,
        Babel.classBody([
          Babel.classMethod(
            'method',
            Babel.identifier('myMethod'),
            [],
            Babel.blockStatement([])
          ),
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('BaseClass'),
            typeLiteral([
              typePropertySignature(
                identifier('myMethod'),
                typeAnnotation(
                  typeFunction(
                    [
                      functionParamName(
                        identifier('self'),
                        typeReference(identifier('BaseClass'))
                      ),
                    ],
                    functionReturnType([typeAny()])
                  )
                )
              ),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('BaseClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'))
                )
              ),
            ]),
            typeReference(identifier('BaseClass')),
            false
          ),
          functionDeclaration(
            identifier('BaseClass:myMethod'),
            [],
            nodeGroup([]),
            undefined,
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert class methods to <ClassId>:<methodName> function with an explicit void return type', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('BaseClass'),
        null,
        Babel.classBody([
          {
            ...Babel.classMethod(
              'method',
              Babel.identifier('myMethod'),
              [],
              Babel.blockStatement([])
            ),
            returnType: Babel.tsTypeAnnotation(Babel.tsVoidKeyword()),
          },
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('BaseClass'),
            typeLiteral([
              typePropertySignature(
                identifier('myMethod'),
                typeAnnotation(
                  typeFunction(
                    [
                      functionParamName(
                        identifier('self'),
                        typeReference(identifier('BaseClass'))
                      ),
                    ],
                    functionReturnType([])
                  )
                )
              ),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('BaseClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'))
                )
              ),
            ]),
            typeReference(identifier('BaseClass')),
            false
          ),
          functionDeclarationMultipleReturn(
            identifier('BaseClass:myMethod'),
            [],
            nodeGroup([]),
            functionReturnType([]),
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert class methods to <ClassId>:<methodName> function with an explicit string return type', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('BaseClass'),
        null,
        Babel.classBody([
          {
            ...Babel.classMethod(
              'method',
              Babel.identifier('myMethod'),
              [],
              Babel.blockStatement([
                Babel.returnStatement(Babel.stringLiteral('foo')),
              ])
            ),
            returnType: Babel.tsTypeAnnotation(Babel.tsStringKeyword()),
          },
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('BaseClass'),
            typeLiteral([
              typePropertySignature(
                identifier('myMethod'),
                typeAnnotation(
                  typeFunction(
                    [
                      functionParamName(
                        identifier('self'),
                        typeReference(identifier('BaseClass'))
                      ),
                    ],
                    functionReturnType([typeString()])
                  )
                )
              ),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('BaseClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'))
                )
              ),
            ]),
            typeReference(identifier('BaseClass')),
            false
          ),
          functionDeclaration(
            identifier('BaseClass:myMethod'),
            [],
            nodeGroup([nodeGroup([returnStatement(stringLiteral('foo'))])]),
            typeString(),
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert static class methods to <ClassId>.<methodName> function', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('BaseClass'),
        null,
        Babel.classBody([
          Babel.classMethod(
            'method',
            Babel.identifier('myStaticMethod'),
            [],
            Babel.blockStatement([]),
            undefined,
            true
          ),
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('BaseClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'))
                )
              ),
            ]),
            typeReference(identifier('BaseClass')),
            false
          ),
          functionDeclaration(
            identifier('BaseClass.myStaticMethod'),
            [],
            nodeGroup([]),
            undefined,
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert non-static properties', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('BaseClass'),
        null,
        Babel.classBody([
          Babel.classProperty(Babel.identifier('nonStaticProperty')),
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('BaseClass'),
            typeLiteral([
              typePropertySignature(
                identifier('nonStaticProperty'),
                typeAnnotation(typeAny())
              ),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('BaseClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'))
                )
              ),
            ]),
            typeReference(identifier('BaseClass')),
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert non-static properties with explicit type', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('BaseClass'),
        null,
        Babel.classBody([
          Babel.classProperty(
            Babel.identifier('nonStaticProperty'),
            null,
            Babel.tsTypeAnnotation(Babel.tSNumberKeyword())
          ),
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('BaseClass'),
            typeLiteral([
              typePropertySignature(
                identifier('nonStaticProperty'),
                typeAnnotation(typeNumber())
              ),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('BaseClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'))
                )
              ),
            ]),
            typeReference(identifier('BaseClass')),
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert non-static properties with type and initial value', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('BaseClass'),
        null,
        Babel.classBody([
          Babel.classProperty(
            Babel.identifier('nonStaticProperty'),
            Babel.stringLiteral('foo'),
            Babel.tsTypeAnnotation(
              Babel.tSUnionType([
                Babel.tsStringKeyword(),
                Babel.tSNumberKeyword(),
              ])
            )
          ),
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('BaseClass'),
            typeLiteral([
              typePropertySignature(
                identifier('nonStaticProperty'),
                typeAnnotation(typeUnion([typeString(), typeNumber()]))
              ),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('BaseClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    selfIdentifier(),
                    '.',
                    identifier('nonStaticProperty')
                  ),
                ],
                [stringLiteral('foo')]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'))
                )
              ),
            ]),
            typeReference(identifier('BaseClass')),
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert non-static properties with initial value', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('BaseClass'),
        null,
        Babel.classBody([
          Babel.classProperty(
            Babel.identifier('nonStaticProperty'),
            Babel.stringLiteral('foo')
          ),
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('BaseClass'),
            typeLiteral([
              typePropertySignature(
                identifier('nonStaticProperty'),
                typeAnnotation(typeString())
              ),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('BaseClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    selfIdentifier(),
                    '.',
                    identifier('nonStaticProperty')
                  ),
                ],
                [stringLiteral('foo')]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'))
                )
              ),
            ]),
            typeReference(identifier('BaseClass')),
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert static properties to <ClassId>.<property>', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('BaseClass'),
        null,
        Babel.classBody([
          Babel.classProperty(
            Babel.identifier('staticProperty'),
            Babel.stringLiteral('foo'),
            undefined,
            undefined,
            undefined,
            true
          ),
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('BaseClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassDefaultExpectedNodes,
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [
              memberExpression(
                identifier('BaseClass'),
                '.',
                identifier('staticProperty')
              ),
            ],
            [stringLiteral('foo')]
          ),
          functionDeclaration(
            identifier(`BaseClass.new`),
            [],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'))
                )
              ),
            ]),
            typeReference(identifier('BaseClass')),
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert class abstract methods to <ClassId>:<methodName> function', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('BaseClass'),
        null,
        Babel.classBody([
          {
            ...Babel.tsDeclareMethod(
              [],
              Babel.identifier('myMethod'),
              null,
              []
            ),
            abstract: true,
          },
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('BaseClass'),
            typeLiteral([
              typePropertySignature(
                identifier('myMethod'),
                typeAnnotation(
                  typeFunction(
                    [
                      functionParamName(
                        identifier('self'),
                        typeReference(identifier('BaseClass'))
                      ),
                    ],
                    functionReturnType([typeAny()])
                  )
                )
              ),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('BaseClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'))
                )
              ),
            ]),
            typeReference(identifier('BaseClass')),
            false
          ),
          functionDeclaration(
            identifier('BaseClass:myMethod'),
            [],
            nodeGroup([
              expressionStatement(
                callExpression(identifier('error'), [
                  stringLiteral('not implemented abstract method'),
                ])
              ),
            ]),
            undefined,
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert constructor params with public modifier', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('BaseClass'),
        null,
        Babel.classBody([
          Babel.classMethod(
            'constructor',
            Babel.identifier('constructor'),
            [
              {
                ...Babel.tsParameterProperty(
                  Babel.identifier('publicProperty')
                ),
                accessibility: 'public',
              },
            ],
            Babel.blockStatement([])
          ),
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('BaseClass'),
            typeLiteral([
              typePropertySignature(
                identifier('publicProperty'),
                typeAnnotation(typeAny())
              ),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [
                        functionParamName(
                          identifier('publicProperty'),
                          typeAny()
                        ),
                      ],
                      functionReturnType([
                        typeReference(identifier('BaseClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [identifier('publicProperty')],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    selfIdentifier(),
                    '.',
                    identifier('publicProperty')
                  ),
                ],
                [identifier('publicProperty')]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'))
                )
              ),
            ]),
            typeReference(identifier('BaseClass')),
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert constructor params with public modifier with type annotation', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('BaseClass'),
        null,
        Babel.classBody([
          Babel.classMethod(
            'constructor',
            Babel.identifier('constructor'),
            [
              {
                ...Babel.tsParameterProperty({
                  ...Babel.identifier('publicProperty'),
                  typeAnnotation: Babel.tsTypeAnnotation(
                    Babel.tsStringKeyword()
                  ),
                }),
                accessibility: 'public',
              },
            ],
            Babel.blockStatement([])
          ),
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('BaseClass'),
            typeLiteral([
              typePropertySignature(
                identifier('publicProperty'),
                typeAnnotation(typeString())
              ),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [
                        functionParamName(
                          identifier('publicProperty'),
                          typeString()
                        ),
                      ],
                      functionReturnType([
                        typeReference(identifier('BaseClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [identifier('publicProperty', typeAnnotation(typeString()))],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    selfIdentifier(),
                    '.',
                    identifier('publicProperty')
                  ),
                ],
                [identifier('publicProperty')]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'))
                )
              ),
            ]),
            typeReference(identifier('BaseClass')),
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert constructor params with public modifier with default value', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('BaseClass'),
        null,
        Babel.classBody([
          Babel.classMethod(
            'constructor',
            Babel.identifier('constructor'),
            [
              {
                ...Babel.tsParameterProperty(
                  Babel.assignmentPattern(
                    Babel.identifier('publicProperty'),
                    Babel.stringLiteral('foo')
                  )
                ),
                accessibility: 'public',
              },
            ],
            Babel.blockStatement([])
          ),
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('BaseClass'),
            typeLiteral([
              typePropertySignature(
                identifier('publicProperty'),
                typeAnnotation(typeString())
              ),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [
                        functionParamName(
                          identifier('publicProperty_'),
                          typeOptional(typeString())
                        ),
                      ],
                      functionReturnType([
                        typeReference(identifier('BaseClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [
              identifier(
                'publicProperty_',
                typeAnnotation(typeOptional(typeString()))
              ),
            ],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              variableDeclaration(
                [
                  variableDeclaratorIdentifier(
                    identifier('publicProperty', typeAnnotation(typeString()))
                  ),
                ],
                [
                  variableDeclaratorValue(
                    ifElseExpression(
                      ifExpressionClause(
                        binaryExpression(
                          identifier('publicProperty_'),
                          '~=',
                          nilLiteral()
                        ),
                        identifier('publicProperty_')
                      ),
                      elseExpressionClause(stringLiteral('foo'))
                    )
                  ),
                ]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    selfIdentifier(),
                    '.',
                    identifier('publicProperty')
                  ),
                ],
                [identifier('publicProperty')]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'))
                )
              ),
            ]),
            typeReference(identifier('BaseClass')),
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert constructor params with public modifier with default value and explicit type annotation', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('BaseClass'),
        null,
        Babel.classBody([
          Babel.classMethod(
            'constructor',
            Babel.identifier('constructor'),
            [
              {
                ...Babel.tsParameterProperty(
                  Babel.assignmentPattern(
                    {
                      ...Babel.identifier('publicProperty'),
                      typeAnnotation: Babel.tSTypeAnnotation(
                        Babel.tSUnionType([
                          Babel.tsStringKeyword(),
                          Babel.tSNumberKeyword(),
                        ])
                      ),
                    },
                    Babel.stringLiteral('foo')
                  )
                ),
                accessibility: 'public',
              },
            ],
            Babel.blockStatement([])
          ),
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('BaseClass'),
            typeLiteral([
              typePropertySignature(
                identifier('publicProperty'),
                typeAnnotation(typeUnion([typeString(), typeNumber()]))
              ),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [
                        functionParamName(
                          identifier('publicProperty_'),
                          typeOptional(typeUnion([typeString(), typeNumber()]))
                        ),
                      ],
                      functionReturnType([
                        typeReference(identifier('BaseClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [
              identifier(
                'publicProperty_',
                typeAnnotation(
                  typeOptional(typeUnion([typeString(), typeNumber()]))
                )
              ),
            ],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(selfIdentifier())],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('BaseClass'),
                    ])
                  ),
                ]
              ),
              variableDeclaration(
                [
                  variableDeclaratorIdentifier(
                    identifier(
                      'publicProperty',
                      typeAnnotation(typeUnion([typeString(), typeNumber()]))
                    )
                  ),
                ],
                [
                  variableDeclaratorValue(
                    ifElseExpression(
                      ifExpressionClause(
                        binaryExpression(
                          identifier('publicProperty_'),
                          '~=',
                          nilLiteral()
                        ),
                        identifier('publicProperty_')
                      ),
                      elseExpressionClause(stringLiteral('foo'))
                    )
                  ),
                ]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    selfIdentifier(),
                    '.',
                    identifier('publicProperty')
                  ),
                ],
                [identifier('publicProperty')]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('BaseClass'))
                )
              ),
            ]),
            typeReference(identifier('BaseClass')),
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    describe('private members', () => {
      it('should convert constructor params with private modifier', () => {
        const given = Babel.classDeclaration(
          Babel.identifier('BaseClass'),
          null,
          Babel.classBody([
            Babel.classMethod(
              'constructor',
              Babel.identifier('constructor'),
              [
                {
                  ...Babel.tsParameterProperty(
                    Babel.identifier('privateProperty')
                  ),
                  accessibility: 'private',
                },
              ],
              Babel.blockStatement([])
            ),
          ])
        );

        const expected = withClassDeclarationExtra(
          nodeGroup([
            typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
            nodeGroup([
              typeAliasDeclaration(
                identifier('BaseClass_private'),
                typeLiteral([
                  withLeadingComments(
                    typePropertySignature(
                      identifier('privateProperty'),
                      typeAnnotation(typeAny())
                    ),
                    commentLine(''),
                    commentLine(' *** PRIVATE *** '),
                    commentLine('')
                  ),
                ])
              ),
              typeAliasDeclaration(
                identifier('BaseClass_statics'),
                typeLiteral([
                  typePropertySignature(
                    identifier('new'),
                    typeAnnotation(
                      typeFunction(
                        [
                          functionParamName(
                            identifier('privateProperty'),
                            typeAny()
                          ),
                        ],
                        functionReturnType([
                          typeReference(identifier('BaseClass')),
                        ])
                      )
                    )
                  ),
                ])
              ),
            ]),
            ...baseClassPrivateExpectedNodes,
            functionDeclaration(
              identifier(`BaseClass_private.new`),
              [identifier('privateProperty')],
              nodeGroup([
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('BaseClass'),
                      ])
                    ),
                  ]
                ),
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [
                    memberExpression(
                      selfIdentifier(),
                      '.',
                      identifier('privateProperty')
                    ),
                  ],
                  [identifier('privateProperty')]
                ),
                returnStatement(
                  typeCastExpression(
                    typeCastExpression(selfIdentifier(), typeAny()),
                    typeReference(identifier('BaseClass'))
                  )
                ),
              ]),
              typeReference(identifier('BaseClass')),
              false
            ),
          ])
        );

        const actual = statementHandler.handler(source, {}, given);
        expect(actual).toEqual(expected);
      });

      it('should convert constructor params with private modifier with type annotation', () => {
        const given = Babel.classDeclaration(
          Babel.identifier('BaseClass'),
          null,
          Babel.classBody([
            Babel.classMethod(
              'constructor',
              Babel.identifier('constructor'),
              [
                {
                  ...Babel.tsParameterProperty({
                    ...Babel.identifier('privateProperty'),
                    typeAnnotation: Babel.tsTypeAnnotation(
                      Babel.tsStringKeyword()
                    ),
                  }),
                  accessibility: 'private',
                },
              ],
              Babel.blockStatement([])
            ),
          ])
        );

        const expected = withClassDeclarationExtra(
          nodeGroup([
            typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
            nodeGroup([
              typeAliasDeclaration(
                identifier('BaseClass_private'),
                typeLiteral([
                  withLeadingComments(
                    typePropertySignature(
                      identifier('privateProperty'),
                      typeAnnotation(typeString())
                    ),
                    commentLine(''),
                    commentLine(' *** PRIVATE *** '),
                    commentLine('')
                  ),
                ])
              ),
              typeAliasDeclaration(
                identifier('BaseClass_statics'),
                typeLiteral([
                  typePropertySignature(
                    identifier('new'),
                    typeAnnotation(
                      typeFunction(
                        [
                          functionParamName(
                            identifier('privateProperty'),
                            typeString()
                          ),
                        ],
                        functionReturnType([
                          typeReference(identifier('BaseClass')),
                        ])
                      )
                    )
                  ),
                ])
              ),
            ]),
            ...baseClassPrivateExpectedNodes,
            functionDeclaration(
              identifier(`BaseClass_private.new`),
              [identifier('privateProperty', typeAnnotation(typeString()))],
              nodeGroup([
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('BaseClass'),
                      ])
                    ),
                  ]
                ),
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [
                    memberExpression(
                      selfIdentifier(),
                      '.',
                      identifier('privateProperty')
                    ),
                  ],
                  [identifier('privateProperty')]
                ),
                returnStatement(
                  typeCastExpression(
                    typeCastExpression(selfIdentifier(), typeAny()),
                    typeReference(identifier('BaseClass'))
                  )
                ),
              ]),
              typeReference(identifier('BaseClass')),
              false
            ),
          ])
        );

        expect(statementHandler.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert constructor params with private modifier with default value', () => {
        const given = Babel.classDeclaration(
          Babel.identifier('BaseClass'),
          null,
          Babel.classBody([
            Babel.classMethod(
              'constructor',
              Babel.identifier('constructor'),
              [
                {
                  ...Babel.tsParameterProperty(
                    Babel.assignmentPattern(
                      Babel.identifier('privateProperty'),
                      Babel.stringLiteral('foo')
                    )
                  ),
                  accessibility: 'private',
                },
              ],
              Babel.blockStatement([])
            ),
          ])
        );

        const expected = withClassDeclarationExtra(
          nodeGroup([
            typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
            nodeGroup([
              typeAliasDeclaration(
                identifier('BaseClass_private'),
                typeLiteral([
                  withLeadingComments(
                    typePropertySignature(
                      identifier('privateProperty'),
                      typeAnnotation(typeString())
                    ),
                    commentLine(''),
                    commentLine(' *** PRIVATE *** '),
                    commentLine('')
                  ),
                ])
              ),
              typeAliasDeclaration(
                identifier('BaseClass_statics'),
                typeLiteral([
                  typePropertySignature(
                    identifier('new'),
                    typeAnnotation(
                      typeFunction(
                        [
                          functionParamName(
                            identifier('privateProperty_'),
                            typeOptional(typeString())
                          ),
                        ],
                        functionReturnType([
                          typeReference(identifier('BaseClass')),
                        ])
                      )
                    )
                  ),
                ])
              ),
            ]),
            ...baseClassPrivateExpectedNodes,
            functionDeclaration(
              identifier(`BaseClass_private.new`),
              [
                identifier(
                  'privateProperty_',
                  typeAnnotation(typeOptional(typeString()))
                ),
              ],
              nodeGroup([
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('BaseClass'),
                      ])
                    ),
                  ]
                ),
                variableDeclaration(
                  [
                    variableDeclaratorIdentifier(
                      identifier(
                        'privateProperty',
                        typeAnnotation(typeString())
                      )
                    ),
                  ],
                  [
                    variableDeclaratorValue(
                      ifElseExpression(
                        ifExpressionClause(
                          binaryExpression(
                            identifier('privateProperty_'),
                            '~=',
                            nilLiteral()
                          ),
                          identifier('privateProperty_')
                        ),
                        elseExpressionClause(stringLiteral('foo'))
                      )
                    ),
                  ]
                ),
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [
                    memberExpression(
                      selfIdentifier(),
                      '.',
                      identifier('privateProperty')
                    ),
                  ],
                  [identifier('privateProperty')]
                ),
                returnStatement(
                  typeCastExpression(
                    typeCastExpression(selfIdentifier(), typeAny()),
                    typeReference(identifier('BaseClass'))
                  )
                ),
              ]),
              typeReference(identifier('BaseClass')),
              false
            ),
          ])
        );

        expect(statementHandler.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert constructor params with private modifier with default value and explicit type annotation', () => {
        const given = Babel.classDeclaration(
          Babel.identifier('BaseClass'),
          null,
          Babel.classBody([
            Babel.classMethod(
              'constructor',
              Babel.identifier('constructor'),
              [
                {
                  ...Babel.tsParameterProperty(
                    Babel.assignmentPattern(
                      {
                        ...Babel.identifier('privateProperty'),
                        typeAnnotation: Babel.tSTypeAnnotation(
                          Babel.tSUnionType([
                            Babel.tsStringKeyword(),
                            Babel.tSNumberKeyword(),
                          ])
                        ),
                      },
                      Babel.stringLiteral('foo')
                    )
                  ),
                  accessibility: 'private',
                },
              ],
              Babel.blockStatement([])
            ),
          ])
        );

        const expected = withClassDeclarationExtra(
          nodeGroup([
            typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
            nodeGroup([
              typeAliasDeclaration(
                identifier('BaseClass_private'),
                typeLiteral([
                  withLeadingComments(
                    typePropertySignature(
                      identifier('privateProperty'),
                      typeAnnotation(typeUnion([typeString(), typeNumber()]))
                    ),
                    commentLine(''),
                    commentLine(' *** PRIVATE *** '),
                    commentLine('')
                  ),
                ])
              ),
              typeAliasDeclaration(
                identifier('BaseClass_statics'),
                typeLiteral([
                  typePropertySignature(
                    identifier('new'),
                    typeAnnotation(
                      typeFunction(
                        [
                          functionParamName(
                            identifier('privateProperty_'),
                            typeOptional(
                              typeUnion([typeString(), typeNumber()])
                            )
                          ),
                        ],
                        functionReturnType([
                          typeReference(identifier('BaseClass')),
                        ])
                      )
                    )
                  ),
                ])
              ),
            ]),
            ...baseClassPrivateExpectedNodes,
            functionDeclaration(
              identifier(`BaseClass_private.new`),
              [
                identifier(
                  'privateProperty_',
                  typeAnnotation(
                    typeOptional(typeUnion([typeString(), typeNumber()]))
                  )
                ),
              ],
              nodeGroup([
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('BaseClass'),
                      ])
                    ),
                  ]
                ),
                variableDeclaration(
                  [
                    variableDeclaratorIdentifier(
                      identifier(
                        'privateProperty',
                        typeAnnotation(typeUnion([typeString(), typeNumber()]))
                      )
                    ),
                  ],
                  [
                    variableDeclaratorValue(
                      ifElseExpression(
                        ifExpressionClause(
                          binaryExpression(
                            identifier('privateProperty_'),
                            '~=',
                            nilLiteral()
                          ),
                          identifier('privateProperty_')
                        ),
                        elseExpressionClause(stringLiteral('foo'))
                      )
                    ),
                  ]
                ),
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [
                    memberExpression(
                      selfIdentifier(),
                      '.',
                      identifier('privateProperty')
                    ),
                  ],
                  [identifier('privateProperty')]
                ),
                returnStatement(
                  typeCastExpression(
                    typeCastExpression(selfIdentifier(), typeAny()),
                    typeReference(identifier('BaseClass'))
                  )
                ),
              ]),
              typeReference(identifier('BaseClass')),
              false
            ),
          ])
        );

        expect(statementHandler.handler(source, {}, given)).toEqual(expected);
      });
    });

    describe('protected members', () => {
      it('should convert constructor params with private modifier', () => {
        const given = Babel.classDeclaration(
          Babel.identifier('BaseClass'),
          null,
          Babel.classBody([
            Babel.classMethod(
              'constructor',
              Babel.identifier('constructor'),
              [
                {
                  ...Babel.tsParameterProperty(
                    Babel.identifier('protectedProperty')
                  ),
                  accessibility: 'protected',
                },
              ],
              Babel.blockStatement([])
            ),
          ])
        );

        const expected = withClassDeclarationExtra(
          nodeGroup([
            typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
            nodeGroup([
              typeAliasDeclaration(
                identifier('BaseClass_private'),
                typeLiteral([
                  withLeadingComments(
                    typePropertySignature(
                      identifier('protectedProperty'),
                      typeAnnotation(typeAny())
                    ),
                    commentLine(''),
                    commentLine(' *** PROTECTED *** '),
                    commentLine('')
                  ),
                ])
              ),
              typeAliasDeclaration(
                identifier('BaseClass_statics'),
                typeLiteral([
                  typePropertySignature(
                    identifier('new'),
                    typeAnnotation(
                      typeFunction(
                        [
                          functionParamName(
                            identifier('protectedProperty'),
                            typeAny()
                          ),
                        ],
                        functionReturnType([
                          typeReference(identifier('BaseClass')),
                        ])
                      )
                    )
                  ),
                ])
              ),
            ]),
            ...baseClassPrivateExpectedNodes,
            functionDeclaration(
              identifier(`BaseClass_private.new`),
              [identifier('protectedProperty')],
              nodeGroup([
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('BaseClass'),
                      ])
                    ),
                  ]
                ),
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [
                    memberExpression(
                      selfIdentifier(),
                      '.',
                      identifier('protectedProperty')
                    ),
                  ],
                  [identifier('protectedProperty')]
                ),
                returnStatement(
                  typeCastExpression(
                    typeCastExpression(selfIdentifier(), typeAny()),
                    typeReference(identifier('BaseClass'))
                  )
                ),
              ]),
              typeReference(identifier('BaseClass')),
              false
            ),
          ])
        );

        const actual = statementHandler.handler(source, {}, given);
        expect(actual).toEqual(expected);
      });

      it('should convert constructor params with protected modifier with type annotation', () => {
        const given = Babel.classDeclaration(
          Babel.identifier('BaseClass'),
          null,
          Babel.classBody([
            Babel.classMethod(
              'constructor',
              Babel.identifier('constructor'),
              [
                {
                  ...Babel.tsParameterProperty({
                    ...Babel.identifier('protectedProperty'),
                    typeAnnotation: Babel.tsTypeAnnotation(
                      Babel.tsStringKeyword()
                    ),
                  }),
                  accessibility: 'protected',
                },
              ],
              Babel.blockStatement([])
            ),
          ])
        );

        const expected = withClassDeclarationExtra(
          nodeGroup([
            typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
            nodeGroup([
              typeAliasDeclaration(
                identifier('BaseClass_private'),
                typeLiteral([
                  withLeadingComments(
                    typePropertySignature(
                      identifier('protectedProperty'),
                      typeAnnotation(typeString())
                    ),
                    commentLine(''),
                    commentLine(' *** PROTECTED *** '),
                    commentLine('')
                  ),
                ])
              ),
              typeAliasDeclaration(
                identifier('BaseClass_statics'),
                typeLiteral([
                  typePropertySignature(
                    identifier('new'),
                    typeAnnotation(
                      typeFunction(
                        [
                          functionParamName(
                            identifier('protectedProperty'),
                            typeString()
                          ),
                        ],
                        functionReturnType([
                          typeReference(identifier('BaseClass')),
                        ])
                      )
                    )
                  ),
                ])
              ),
            ]),
            ...baseClassPrivateExpectedNodes,
            functionDeclaration(
              identifier(`BaseClass_private.new`),
              [identifier('protectedProperty', typeAnnotation(typeString()))],
              nodeGroup([
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('BaseClass'),
                      ])
                    ),
                  ]
                ),
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [
                    memberExpression(
                      selfIdentifier(),
                      '.',
                      identifier('protectedProperty')
                    ),
                  ],
                  [identifier('protectedProperty')]
                ),
                returnStatement(
                  typeCastExpression(
                    typeCastExpression(selfIdentifier(), typeAny()),
                    typeReference(identifier('BaseClass'))
                  )
                ),
              ]),
              typeReference(identifier('BaseClass')),
              false
            ),
          ])
        );

        expect(statementHandler.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert constructor params with protected modifier with default value', () => {
        const given = Babel.classDeclaration(
          Babel.identifier('BaseClass'),
          null,
          Babel.classBody([
            Babel.classMethod(
              'constructor',
              Babel.identifier('constructor'),
              [
                {
                  ...Babel.tsParameterProperty(
                    Babel.assignmentPattern(
                      Babel.identifier('protectedProperty'),
                      Babel.stringLiteral('foo')
                    )
                  ),
                  accessibility: 'protected',
                },
              ],
              Babel.blockStatement([])
            ),
          ])
        );

        const expected = withClassDeclarationExtra(
          nodeGroup([
            typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
            nodeGroup([
              typeAliasDeclaration(
                identifier('BaseClass_private'),
                typeLiteral([
                  withLeadingComments(
                    typePropertySignature(
                      identifier('protectedProperty'),
                      typeAnnotation(typeString())
                    ),
                    commentLine(''),
                    commentLine(' *** PROTECTED *** '),
                    commentLine('')
                  ),
                ])
              ),
              typeAliasDeclaration(
                identifier('BaseClass_statics'),
                typeLiteral([
                  typePropertySignature(
                    identifier('new'),
                    typeAnnotation(
                      typeFunction(
                        [
                          functionParamName(
                            identifier('protectedProperty_'),
                            typeOptional(typeString())
                          ),
                        ],
                        functionReturnType([
                          typeReference(identifier('BaseClass')),
                        ])
                      )
                    )
                  ),
                ])
              ),
            ]),
            ...baseClassPrivateExpectedNodes,
            functionDeclaration(
              identifier(`BaseClass_private.new`),
              [
                identifier(
                  'protectedProperty_',
                  typeAnnotation(typeOptional(typeString()))
                ),
              ],
              nodeGroup([
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('BaseClass'),
                      ])
                    ),
                  ]
                ),
                variableDeclaration(
                  [
                    variableDeclaratorIdentifier(
                      identifier(
                        'protectedProperty',
                        typeAnnotation(typeString())
                      )
                    ),
                  ],
                  [
                    variableDeclaratorValue(
                      ifElseExpression(
                        ifExpressionClause(
                          binaryExpression(
                            identifier('protectedProperty_'),
                            '~=',
                            nilLiteral()
                          ),
                          identifier('protectedProperty_')
                        ),
                        elseExpressionClause(stringLiteral('foo'))
                      )
                    ),
                  ]
                ),
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [
                    memberExpression(
                      selfIdentifier(),
                      '.',
                      identifier('protectedProperty')
                    ),
                  ],
                  [identifier('protectedProperty')]
                ),
                returnStatement(
                  typeCastExpression(
                    typeCastExpression(selfIdentifier(), typeAny()),
                    typeReference(identifier('BaseClass'))
                  )
                ),
              ]),
              typeReference(identifier('BaseClass')),
              false
            ),
          ])
        );

        expect(statementHandler.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert constructor params with protected modifier with default value and explicit type annotation', () => {
        const given = Babel.classDeclaration(
          Babel.identifier('BaseClass'),
          null,
          Babel.classBody([
            Babel.classMethod(
              'constructor',
              Babel.identifier('constructor'),
              [
                {
                  ...Babel.tsParameterProperty(
                    Babel.assignmentPattern(
                      {
                        ...Babel.identifier('protectedProperty'),
                        typeAnnotation: Babel.tSTypeAnnotation(
                          Babel.tSUnionType([
                            Babel.tsStringKeyword(),
                            Babel.tSNumberKeyword(),
                          ])
                        ),
                      },
                      Babel.stringLiteral('foo')
                    )
                  ),
                  accessibility: 'protected',
                },
              ],
              Babel.blockStatement([])
            ),
          ])
        );

        const expected = withClassDeclarationExtra(
          nodeGroup([
            typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
            nodeGroup([
              typeAliasDeclaration(
                identifier('BaseClass_private'),
                typeLiteral([
                  withLeadingComments(
                    typePropertySignature(
                      identifier('protectedProperty'),
                      typeAnnotation(typeUnion([typeString(), typeNumber()]))
                    ),
                    commentLine(''),
                    commentLine(' *** PROTECTED *** '),
                    commentLine('')
                  ),
                ])
              ),
              typeAliasDeclaration(
                identifier('BaseClass_statics'),
                typeLiteral([
                  typePropertySignature(
                    identifier('new'),
                    typeAnnotation(
                      typeFunction(
                        [
                          functionParamName(
                            identifier('protectedProperty_'),
                            typeOptional(
                              typeUnion([typeString(), typeNumber()])
                            )
                          ),
                        ],
                        functionReturnType([
                          typeReference(identifier('BaseClass')),
                        ])
                      )
                    )
                  ),
                ])
              ),
            ]),
            ...baseClassPrivateExpectedNodes,
            functionDeclaration(
              identifier(`BaseClass_private.new`),
              [
                identifier(
                  'protectedProperty_',
                  typeAnnotation(
                    typeOptional(typeUnion([typeString(), typeNumber()]))
                  )
                ),
              ],
              nodeGroup([
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('BaseClass'),
                      ])
                    ),
                  ]
                ),
                variableDeclaration(
                  [
                    variableDeclaratorIdentifier(
                      identifier(
                        'protectedProperty',
                        typeAnnotation(typeUnion([typeString(), typeNumber()]))
                      )
                    ),
                  ],
                  [
                    variableDeclaratorValue(
                      ifElseExpression(
                        ifExpressionClause(
                          binaryExpression(
                            identifier('protectedProperty_'),
                            '~=',
                            nilLiteral()
                          ),
                          identifier('protectedProperty_')
                        ),
                        elseExpressionClause(stringLiteral('foo'))
                      )
                    ),
                  ]
                ),
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [
                    memberExpression(
                      selfIdentifier(),
                      '.',
                      identifier('protectedProperty')
                    ),
                  ],
                  [identifier('protectedProperty')]
                ),
                returnStatement(
                  typeCastExpression(
                    typeCastExpression(selfIdentifier(), typeAny()),
                    typeReference(identifier('BaseClass'))
                  )
                ),
              ]),
              typeReference(identifier('BaseClass')),
              false
            ),
          ])
        );

        expect(statementHandler.handler(source, {}, given)).toEqual(expected);
      });
    });

    describe('mixed members', () => {
      it('should convert constructor params with mixed modifiers', () => {
        const given = Babel.classDeclaration(
          Babel.identifier('BaseClass'),
          null,
          Babel.classBody([
            Babel.classMethod(
              'constructor',
              Babel.identifier('constructor'),
              [
                {
                  ...Babel.tsParameterProperty(
                    Babel.identifier('publicProperty')
                  ),
                  accessibility: 'public',
                },
                {
                  ...Babel.tsParameterProperty(
                    Babel.identifier('protectedProperty')
                  ),
                  accessibility: 'protected',
                },
                {
                  ...Babel.tsParameterProperty(
                    Babel.identifier('privateProperty')
                  ),
                  accessibility: 'private',
                },
              ],
              Babel.blockStatement([])
            ),
          ])
        );

        const expected = withClassDeclarationExtra(
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass'),
              typeLiteral([
                typePropertySignature(
                  identifier('publicProperty'),
                  typeAnnotation(typeAny())
                ),
              ])
            ),
            nodeGroup([
              typeAliasDeclaration(
                identifier('BaseClass_private'),
                typeLiteral([
                  withLeadingComments(
                    typePropertySignature(
                      identifier('publicProperty'),
                      typeAnnotation(typeAny())
                    ),
                    commentLine(''),
                    commentLine(' *** PUBLIC *** '),
                    commentLine('')
                  ),
                  withLeadingComments(
                    typePropertySignature(
                      identifier('protectedProperty'),
                      typeAnnotation(typeAny())
                    ),
                    commentLine(''),
                    commentLine(' *** PROTECTED *** '),
                    commentLine('')
                  ),
                  withLeadingComments(
                    typePropertySignature(
                      identifier('privateProperty'),
                      typeAnnotation(typeAny())
                    ),
                    commentLine(''),
                    commentLine(' *** PRIVATE *** '),
                    commentLine('')
                  ),
                ])
              ),

              typeAliasDeclaration(
                identifier('BaseClass_statics'),
                typeLiteral([
                  typePropertySignature(
                    identifier('new'),
                    typeAnnotation(
                      typeFunction(
                        [
                          functionParamName(
                            identifier('publicProperty'),
                            typeAny()
                          ),
                          functionParamName(
                            identifier('protectedProperty'),
                            typeAny()
                          ),
                          functionParamName(
                            identifier('privateProperty'),
                            typeAny()
                          ),
                        ],
                        functionReturnType([
                          typeReference(identifier('BaseClass')),
                        ])
                      )
                    )
                  ),
                ])
              ),
            ]),
            ...baseClassPrivateExpectedNodes,
            functionDeclaration(
              identifier(`BaseClass_private.new`),
              [
                identifier('publicProperty'),
                identifier('protectedProperty'),
                identifier('privateProperty'),
              ],
              nodeGroup([
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('BaseClass'),
                      ])
                    ),
                  ]
                ),
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [
                    memberExpression(
                      selfIdentifier(),
                      '.',
                      identifier('publicProperty')
                    ),
                  ],
                  [identifier('publicProperty')]
                ),
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [
                    memberExpression(
                      selfIdentifier(),
                      '.',
                      identifier('protectedProperty')
                    ),
                  ],
                  [identifier('protectedProperty')]
                ),
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [
                    memberExpression(
                      selfIdentifier(),
                      '.',
                      identifier('privateProperty')
                    ),
                  ],
                  [identifier('privateProperty')]
                ),
                returnStatement(
                  typeCastExpression(
                    typeCastExpression(selfIdentifier(), typeAny()),
                    typeReference(identifier('BaseClass'))
                  )
                ),
              ]),
              typeReference(identifier('BaseClass')),
              false
            ),
          ])
        );

        const actual = statementHandler.handler(source, {}, given);
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('SubClass', () => {
    const subClassDefaultExpectedNodes = [
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('SubClass'))],
        [
          variableDeclaratorValue(
            typeCastExpression(
              typeCastExpression(
                callExpression(identifier('setmetatable'), [
                  tableConstructor(),
                  tableConstructor([
                    tableNameKeyField(
                      identifier('__index'),
                      identifier('BaseClass')
                    ),
                  ]),
                ]),
                typeAny()
              ),
              typeIntersection([
                typeReference(identifier('SubClass')),
                typeReference(identifier('SubClass_statics')),
              ])
            )
          ),
        ]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [
          memberExpression(
            typeCastExpression(identifier('SubClass'), typeAny()),
            '.',
            identifier('__index')
          ),
        ],
        [identifier('SubClass')]
      ),
    ] as const;

    const subClassGenericExpectedNodes = [
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('SubClass'))],
        [
          variableDeclaratorValue(
            typeCastExpression(
              typeCastExpression(
                callExpression(identifier('setmetatable'), [
                  tableConstructor(),
                  tableConstructor([
                    tableNameKeyField(
                      identifier('__index'),
                      identifier('BaseClass')
                    ),
                  ]),
                ]),
                typeAny()
              ),
              typeIntersection([
                typeReference(identifier('SubClass'), [typeAny()]),
                typeReference(identifier('SubClass_statics')),
              ])
            )
          ),
        ]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [
          memberExpression(
            typeCastExpression(identifier('SubClass'), typeAny()),
            '.',
            identifier('__index')
          ),
        ],
        [identifier('SubClass')]
      ),
    ] as const;

    const subClassGenericMultipleExpectedNodes = [
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('SubClass'))],
        [
          variableDeclaratorValue(
            typeCastExpression(
              typeCastExpression(
                callExpression(identifier('setmetatable'), [
                  tableConstructor(),
                  tableConstructor([
                    tableNameKeyField(
                      identifier('__index'),
                      identifier('BaseClass')
                    ),
                  ]),
                ]),
                typeAny()
              ),
              typeIntersection([
                typeReference(identifier('SubClass'), [typeAny(), typeAny()]),
                typeReference(identifier('SubClass_statics')),
              ])
            )
          ),
        ]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [
          memberExpression(
            typeCastExpression(identifier('SubClass'), typeAny()),
            '.',
            identifier('__index')
          ),
        ],
        [identifier('SubClass')]
      ),
    ] as const;

    it('should convert class', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('SubClass'),
        Babel.identifier('BaseClass'),
        Babel.classBody([])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('SubClass'),
            typeIntersection([
              typeReference(identifier('BaseClass')),
              typeLiteral([]),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('SubClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('SubClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...subClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`SubClass.new`),
            [],
            nodeGroup([
              withTrailingConversionComment(
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('SubClass'),
                      ])
                    ),
                  ]
                ),
                `ROBLOX TODO: super constructor may be used`
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('SubClass'))
                )
              ),
            ]),
            typeReference(identifier('SubClass')),
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert generic class with generic type params', () => {
      const given = {
        ...Babel.classDeclaration(
          Babel.identifier('SubClass'),
          Babel.identifier('BaseClass'),
          Babel.classBody([])
        ),
        typeParameters: Babel.tSTypeParameterDeclaration([
          Babel.tsTypeParameter(null, null, 'T'),
        ]),
      };

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('SubClass'),
            typeIntersection([
              typeReference(identifier('BaseClass')),
              typeLiteral([]),
            ]),
            typeParameterDeclaration([typeReference(identifier('T'))])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('SubClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('SubClass'), [
                          typeReference(identifier('T')),
                        ]),
                      ]),
                      typeParameterDeclaration([typeReference(identifier('T'))])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...subClassGenericExpectedNodes,
          functionDeclaration(
            identifier(`SubClass.new`),
            [],
            nodeGroup([
              withTrailingConversionComment(
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('SubClass'),
                      ])
                    ),
                  ]
                ),
                `ROBLOX TODO: super constructor may be used`
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('SubClass'), [
                    typeReference(identifier('T')),
                  ])
                )
              ),
            ]),
            typeReference(identifier('SubClass'), [
              typeReference(identifier('T')),
            ]),
            false,
            typeParameterDeclaration([typeReference(identifier('T'))])
          ),
        ])
      );

      const actual = statementHandler.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should convert generic class with generic type params with default types', () => {
      const given = {
        ...Babel.classDeclaration(
          Babel.identifier('SubClass'),
          Babel.identifier('BaseClass'),
          Babel.classBody([])
        ),
        typeParameters: Babel.tSTypeParameterDeclaration([
          Babel.tsTypeParameter(null, Babel.tsStringKeyword(), 'T'),
        ]),
      };

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('SubClass'),
            typeIntersection([
              typeReference(identifier('BaseClass')),
              typeLiteral([]),
            ]),
            typeParameterDeclaration([
              typeReference(identifier('T'), undefined, typeString()),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('SubClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('SubClass'), [
                          typeReference(identifier('T')),
                        ]),
                      ]),
                      typeParameterDeclaration([
                        typeReference(identifier('T'), undefined, typeString()),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...subClassGenericExpectedNodes,
          functionDeclaration(
            identifier(`SubClass.new`),
            [],
            nodeGroup([
              withTrailingConversionComment(
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('SubClass'),
                      ])
                    ),
                  ]
                ),
                `ROBLOX TODO: super constructor may be used`
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('SubClass'), [
                    typeReference(identifier('T')),
                  ])
                )
              ),
            ]),
            typeReference(identifier('SubClass'), [
              typeReference(identifier('T')),
            ]),
            false,
            typeParameterDeclaration([
              typeReference(identifier('T'), undefined, typeString()),
            ])
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert generic class with generic type params and generic super types - TS', () => {
      const given: Babel.ClassDeclaration = {
        ...Babel.classDeclaration(
          Babel.identifier('SubClass'),
          Babel.identifier('BaseClass'),
          Babel.classBody([])
        ),
        typeParameters: Babel.tSTypeParameterDeclaration([
          Babel.tsTypeParameter(null, null, 'T'),
          Babel.tsTypeParameter(null, null, 'V'),
        ]),
        superTypeParameters: Babel.tsTypeParameterInstantiation([
          Babel.tsTypeReference(Babel.identifier('V')),
        ]),
      };

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('SubClass'),
            typeIntersection([
              typeReference(identifier('BaseClass'), [
                typeReference(identifier('V')),
              ]),
              typeLiteral([]),
            ]),
            typeParameterDeclaration([
              typeReference(identifier('T')),
              typeReference(identifier('V')),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('SubClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('SubClass'), [
                          typeReference(identifier('T')),
                          typeReference(identifier('V')),
                        ]),
                      ]),
                      typeParameterDeclaration([
                        typeReference(identifier('T')),
                        typeReference(identifier('V')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...subClassGenericMultipleExpectedNodes,
          functionDeclaration(
            identifier(`SubClass.new`),
            [],
            nodeGroup([
              withTrailingConversionComment(
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('SubClass'),
                      ])
                    ),
                  ]
                ),
                `ROBLOX TODO: super constructor may be used`
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('SubClass'), [
                    typeReference(identifier('T')),
                    typeReference(identifier('V')),
                  ])
                )
              ),
            ]),
            typeReference(identifier('SubClass'), [
              typeReference(identifier('T')),
              typeReference(identifier('V')),
            ]),
            false,
            typeParameterDeclaration([
              typeReference(identifier('T')),
              typeReference(identifier('V')),
            ])
          ),
        ])
      );

      const actual = statementHandler.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should convert generic class with generic type params and generic super types - Flow', () => {
      const given: Babel.ClassDeclaration = {
        ...Babel.classDeclaration(
          Babel.identifier('SubClass'),
          Babel.identifier('BaseClass'),
          Babel.classBody([])
        ),
        typeParameters: Babel.typeParameterDeclaration([
          { ...Babel.typeParameter(), name: 'T' },
          { ...Babel.typeParameter(), name: 'V' },
        ]),
        superTypeParameters: Babel.typeParameterInstantiation([
          Babel.genericTypeAnnotation(Babel.identifier('V')),
        ]),
      };

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('SubClass'),
            typeIntersection([
              typeReference(identifier('BaseClass'), [
                typeReference(identifier('V')),
              ]),
              typeLiteral([]),
            ]),
            typeParameterDeclaration([
              typeReference(identifier('T')),
              typeReference(identifier('V')),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('SubClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('SubClass'), [
                          typeReference(identifier('T')),
                          typeReference(identifier('V')),
                        ]),
                      ]),
                      typeParameterDeclaration([
                        typeReference(identifier('T')),
                        typeReference(identifier('V')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...subClassGenericMultipleExpectedNodes,
          functionDeclaration(
            identifier(`SubClass.new`),
            [],
            nodeGroup([
              withTrailingConversionComment(
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('SubClass'),
                      ])
                    ),
                  ]
                ),
                `ROBLOX TODO: super constructor may be used`
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('SubClass'), [
                    typeReference(identifier('T')),
                    typeReference(identifier('V')),
                  ])
                )
              ),
            ]),
            typeReference(identifier('SubClass'), [
              typeReference(identifier('T')),
              typeReference(identifier('V')),
            ]),
            false,
            typeParameterDeclaration([
              typeReference(identifier('T')),
              typeReference(identifier('V')),
            ])
          ),
        ])
      );

      const actual = statementHandler.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should convert class constructor to <ClassId>.new function', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('SubClass'),
        Babel.identifier('BaseClass'),
        Babel.classBody([
          Babel.classMethod(
            'constructor',
            Babel.identifier('constructor'),
            [],
            Babel.blockStatement([])
          ),
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('SubClass'),
            typeIntersection([
              typeReference(identifier('BaseClass')),
              typeLiteral([]),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('SubClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('SubClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...subClassDefaultExpectedNodes,
          functionDeclaration(
            identifier('SubClass.new'),
            [],
            nodeGroup([
              withTrailingConversionComment(
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('SubClass'),
                      ])
                    ),
                  ]
                ),
                `ROBLOX TODO: super constructor may be used`
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('SubClass'))
                )
              ),
            ]),
            typeReference(identifier('SubClass')),
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert class methods to <ClassId>:<methodName> function', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('SubClass'),
        Babel.identifier('BaseClass'),
        Babel.classBody([
          Babel.classMethod(
            'method',
            Babel.identifier('myMethod'),
            [],
            Babel.blockStatement([])
          ),
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('SubClass'),
            typeIntersection([
              typeReference(identifier('BaseClass')),
              typeLiteral([
                typePropertySignature(
                  identifier('myMethod'),
                  typeAnnotation(
                    typeFunction(
                      [
                        functionParamName(
                          identifier('self'),
                          typeReference(identifier('SubClass'))
                        ),
                      ],
                      functionReturnType([typeAny()])
                    )
                  )
                ),
              ]),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('SubClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('SubClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...subClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`SubClass.new`),
            [],
            nodeGroup([
              withTrailingConversionComment(
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('SubClass'),
                      ])
                    ),
                  ]
                ),
                `ROBLOX TODO: super constructor may be used`
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('SubClass'))
                )
              ),
            ]),
            typeReference(identifier('SubClass')),
            false
          ),
          functionDeclaration(
            identifier('SubClass:myMethod'),
            [],
            nodeGroup([]),
            undefined,
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert static class methods to <ClassId>.<methodName> function', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('SubClass'),
        Babel.identifier('BaseClass'),
        Babel.classBody([
          Babel.classMethod(
            'method',
            Babel.identifier('myStaticMethod'),
            [],
            Babel.blockStatement([]),
            undefined,
            true
          ),
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('SubClass'),
            typeIntersection([
              typeReference(identifier('BaseClass')),
              typeLiteral([]),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('SubClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('SubClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...subClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`SubClass.new`),
            [],
            nodeGroup([
              withTrailingConversionComment(
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('SubClass'),
                      ])
                    ),
                  ]
                ),
                `ROBLOX TODO: super constructor may be used`
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('SubClass'))
                )
              ),
            ]),
            typeReference(identifier('SubClass')),
            false
          ),
          functionDeclaration(
            identifier('SubClass.myStaticMethod'),
            [],
            nodeGroup([]),
            undefined,
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert static properties to <ClassId>.<property>', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('SubClass'),
        Babel.identifier('BaseClass'),
        Babel.classBody([
          Babel.classProperty(
            Babel.identifier('staticProperty'),
            Babel.stringLiteral('foo'),
            undefined,
            undefined,
            undefined,
            true
          ),
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('SubClass'),
            typeIntersection([
              typeReference(identifier('BaseClass')),
              typeLiteral([]),
            ])
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('SubClass_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([
                        typeReference(identifier('SubClass')),
                      ])
                    )
                  )
                ),
              ])
            ),
          ]),
          ...subClassDefaultExpectedNodes,
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [
              memberExpression(
                identifier('SubClass'),
                '.',
                identifier('staticProperty')
              ),
            ],
            [stringLiteral('foo')]
          ),
          functionDeclaration(
            identifier(`SubClass.new`),
            [],
            nodeGroup([
              withTrailingConversionComment(
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('SubClass'),
                      ])
                    ),
                  ]
                ),
                `ROBLOX TODO: super constructor may be used`
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('SubClass'))
                )
              ),
            ]),
            typeReference(identifier('SubClass')),
            false
          ),
        ])
      );

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });
  });
});
