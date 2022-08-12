import * as Babel from '@babel/types';
import {
  selfIdentifier,
  withClassDeclarationExtra,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  callExpression,
  expressionStatement,
  functionDeclaration,
  functionDeclarationMultipleReturn,
  functionParamName,
  functionReturnType,
  identifier,
  ifClause,
  ifStatement,
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
    ];

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
    ];

    it('should convert class', () => {
      const given = Babel.classDeclaration(
        Babel.identifier('BaseClass'),
        null,
        Babel.classBody([])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
          typeAliasDeclaration(
            identifier('BaseClass_statics'),
            typeLiteral([
              typePropertySignature(
                identifier('new'),
                typeAnnotation(
                  typeFunction(
                    [],
                    functionReturnType([typeReference(identifier('BaseClass'))])
                  )
                )
              ),
            ])
          ),
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
          typeAliasDeclaration(
            identifier('BaseClass_statics'),
            typeLiteral([
              typePropertySignature(
                identifier('new'),
                typeAnnotation(
                  typeFunction(
                    [],
                    functionReturnType([typeReference(identifier('BaseClass'))])
                  )
                )
              ),
            ])
          ),
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
          typeAliasDeclaration(
            identifier('BaseClass_statics'),
            typeLiteral([
              typePropertySignature(
                identifier('new'),
                typeAnnotation(
                  typeFunction(
                    [],
                    functionReturnType([typeReference(identifier('BaseClass'))])
                  )
                )
              ),
            ])
          ),
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
          typeAliasDeclaration(
            identifier('BaseClass_statics'),
            typeLiteral([
              typePropertySignature(
                identifier('new'),
                typeAnnotation(
                  typeFunction(
                    [],
                    functionReturnType([typeReference(identifier('BaseClass'))])
                  )
                )
              ),
            ])
          ),
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
          typeAliasDeclaration(
            identifier('BaseClass_statics'),
            typeLiteral([
              typePropertySignature(
                identifier('new'),
                typeAnnotation(
                  typeFunction(
                    [],
                    functionReturnType([typeReference(identifier('BaseClass'))])
                  )
                )
              ),
            ])
          ),
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
          typeAliasDeclaration(
            identifier('BaseClass_statics'),
            typeLiteral([
              typePropertySignature(
                identifier('new'),
                typeAnnotation(
                  typeFunction(
                    [],
                    functionReturnType([typeReference(identifier('BaseClass'))])
                  )
                )
              ),
            ])
          ),
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
          typeAliasDeclaration(
            identifier('BaseClass_statics'),
            typeLiteral([
              typePropertySignature(
                identifier('new'),
                typeAnnotation(
                  typeFunction(
                    [],
                    functionReturnType([typeReference(identifier('BaseClass'))])
                  )
                )
              ),
            ])
          ),
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
          typeAliasDeclaration(
            identifier('BaseClass_statics'),
            typeLiteral([
              typePropertySignature(
                identifier('new'),
                typeAnnotation(
                  typeFunction(
                    [],
                    functionReturnType([typeReference(identifier('BaseClass'))])
                  )
                )
              ),
            ])
          ),
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
          typeAliasDeclaration(
            identifier('BaseClass_statics'),
            typeLiteral([
              typePropertySignature(
                identifier('new'),
                typeAnnotation(
                  typeFunction(
                    [],
                    functionReturnType([typeReference(identifier('BaseClass'))])
                  )
                )
              ),
            ])
          ),
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
          typeAliasDeclaration(
            identifier('BaseClass_statics'),
            typeLiteral([
              typePropertySignature(
                identifier('new'),
                typeAnnotation(
                  typeFunction(
                    [],
                    functionReturnType([typeReference(identifier('BaseClass'))])
                  )
                )
              ),
            ])
          ),
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
          typeAliasDeclaration(
            identifier('BaseClass_statics'),
            typeLiteral([
              typePropertySignature(
                identifier('new'),
                typeAnnotation(
                  typeFunction(
                    [],
                    functionReturnType([typeReference(identifier('BaseClass'))])
                  )
                )
              ),
            ])
          ),
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
          typeAliasDeclaration(
            identifier('BaseClass_statics'),
            typeLiteral([
              typePropertySignature(
                identifier('new'),
                typeAnnotation(
                  typeFunction(
                    [],
                    functionReturnType([typeReference(identifier('BaseClass'))])
                  )
                )
              ),
            ])
          ),
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
          typeAliasDeclaration(
            identifier('BaseClass_statics'),
            typeLiteral([
              typePropertySignature(
                identifier('new'),
                typeAnnotation(
                  typeFunction(
                    [],
                    functionReturnType([typeReference(identifier('BaseClass'))])
                  )
                )
              ),
            ])
          ),
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
                    functionReturnType([typeReference(identifier('BaseClass'))])
                  )
                )
              ),
            ])
          ),
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
                    functionReturnType([typeReference(identifier('BaseClass'))])
                  )
                )
              ),
            ])
          ),
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
                        typeOptional(typeString())
                      ),
                    ],
                    functionReturnType([typeReference(identifier('BaseClass'))])
                  )
                )
              ),
            ])
          ),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [
              identifier(
                'publicProperty',
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
              ifStatement(
                ifClause(
                  binaryExpression(
                    identifier('publicProperty'),
                    '==',
                    nilLiteral()
                  ),
                  nodeGroup([
                    assignmentStatement(
                      AssignmentStatementOperatorEnum.EQ,
                      [identifier('publicProperty')],
                      [stringLiteral('foo')]
                    ),
                  ])
                )
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
                        typeOptional(typeUnion([typeString(), typeNumber()]))
                      ),
                    ],
                    functionReturnType([typeReference(identifier('BaseClass'))])
                  )
                )
              ),
            ])
          ),
          ...baseClassDefaultExpectedNodes,
          functionDeclaration(
            identifier(`BaseClass.new`),
            [
              identifier(
                'publicProperty',
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
              ifStatement(
                ifClause(
                  binaryExpression(
                    identifier('publicProperty'),
                    '==',
                    nilLiteral()
                  ),
                  nodeGroup([
                    assignmentStatement(
                      AssignmentStatementOperatorEnum.EQ,
                      [identifier('publicProperty')],
                      [stringLiteral('foo')]
                    ),
                  ])
                )
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
    ];

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
    ];

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
    ];

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
          typeAliasDeclaration(
            identifier('SubClass_statics'),
            typeLiteral([
              typePropertySignature(
                identifier('new'),
                typeAnnotation(
                  typeFunction(
                    [],
                    functionReturnType([typeReference(identifier('SubClass'))])
                  )
                )
              ),
            ])
          ),
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
          typeAliasDeclaration(
            identifier('SubClass_statics'),
            typeLiteral([
              typePropertySignature(
                identifier('new'),
                typeAnnotation(
                  typeFunction(
                    [],
                    functionReturnType([typeReference(identifier('SubClass'))])
                  )
                )
              ),
            ])
          ),
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
          typeAliasDeclaration(
            identifier('SubClass_statics'),
            typeLiteral([
              typePropertySignature(
                identifier('new'),
                typeAnnotation(
                  typeFunction(
                    [],
                    functionReturnType([typeReference(identifier('SubClass'))])
                  )
                )
              ),
            ])
          ),
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
          typeAliasDeclaration(
            identifier('SubClass_statics'),
            typeLiteral([
              typePropertySignature(
                identifier('new'),
                typeAnnotation(
                  typeFunction(
                    [],
                    functionReturnType([typeReference(identifier('SubClass'))])
                  )
                )
              ),
            ])
          ),
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
          typeAliasDeclaration(
            identifier('SubClass_statics'),
            typeLiteral([
              typePropertySignature(
                identifier('new'),
                typeAnnotation(
                  typeFunction(
                    [],
                    functionReturnType([typeReference(identifier('SubClass'))])
                  )
                )
              ),
            ])
          ),
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
