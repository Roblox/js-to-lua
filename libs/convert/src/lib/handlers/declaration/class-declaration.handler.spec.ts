import {
  assignmentPattern,
  blockStatement as babelBlockStatement,
  classBody,
  ClassDeclaration,
  classDeclaration,
  classMethod,
  classProperty,
  genericTypeAnnotation,
  identifier as babelIdentifier,
  returnStatement as babelReturnStatement,
  stringLiteral as babelStringLiteral,
  tsDeclareMethod,
  tSNumberKeyword,
  tsParameterProperty,
  tsStringKeyword,
  tSTypeAnnotation,
  tsTypeAnnotation,
  tsTypeParameter,
  tSTypeParameterDeclaration,
  tsTypeParameterInstantiation,
  tsTypeReference,
  tSUnionType,
  tsVoidKeyword,
  typeParameter as babelTypeParameter,
  typeParameterDeclaration as babelTypeParameterDeclaration,
  typeParameterInstantiation as babelTypeParameterInstantiation,
} from '@babel/types';
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
  functionReturnType,
  functionParamName,
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
import { statementHandler } from '../expression-statement.handler';

const source = '';

describe('Class Declaration', () => {
  describe('Base Class', () => {
    const baseClassDefaultExpectedNodes = [
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('BaseClass'))],
        [variableDeclaratorValue(tableConstructor())]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [memberExpression(identifier('BaseClass'), '.', identifier('__index'))],
        [identifier('BaseClass')]
      ),
    ];

    it('should convert class', () => {
      const given = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
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
        ...classDeclaration(babelIdentifier('BaseClass'), null, classBody([])),
        typeParameters: tSTypeParameterDeclaration([]),
      };

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
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
        ...classDeclaration(babelIdentifier('BaseClass'), null, classBody([])),
        typeParameters: tSTypeParameterDeclaration([
          tsTypeParameter(null, null, 'T'),
        ]),
      };

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(
            identifier('BaseClass'),
            typeLiteral([]),
            typeParameterDeclaration([typeReference(identifier('T'))])
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

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert generic class with generic type params with default values', () => {
      const given = {
        ...classDeclaration(babelIdentifier('BaseClass'), null, classBody([])),
        typeParameters: tSTypeParameterDeclaration([
          tsTypeParameter(null, tsStringKeyword(), 'T'),
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
      const given = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          classMethod(
            'constructor',
            babelIdentifier('constructor'),
            [],
            babelBlockStatement([])
          ),
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
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
      const given = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          classMethod(
            'method',
            babelIdentifier('myMethod'),
            [],
            babelBlockStatement([])
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
      const given = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          {
            ...classMethod(
              'method',
              babelIdentifier('myMethod'),
              [],
              babelBlockStatement([])
            ),
            returnType: tsTypeAnnotation(tsVoidKeyword()),
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
      const given = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          {
            ...classMethod(
              'method',
              babelIdentifier('myMethod'),
              [],
              babelBlockStatement([
                babelReturnStatement(babelStringLiteral('foo')),
              ])
            ),
            returnType: tsTypeAnnotation(tsStringKeyword()),
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
      const given = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          classMethod(
            'method',
            babelIdentifier('myStaticMethod'),
            [],
            babelBlockStatement([]),
            undefined,
            true
          ),
        ])
      );

      const expected = withClassDeclarationExtra(
        nodeGroup([
          typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
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
      const given = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([classProperty(babelIdentifier('nonStaticProperty'))])
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
      const given = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          classProperty(
            babelIdentifier('nonStaticProperty'),
            null,
            tsTypeAnnotation(tSNumberKeyword())
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
      const given = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          classProperty(
            babelIdentifier('nonStaticProperty'),
            babelStringLiteral('foo'),
            tsTypeAnnotation(
              tSUnionType([tsStringKeyword(), tSNumberKeyword()])
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
      const given = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          classProperty(
            babelIdentifier('nonStaticProperty'),
            babelStringLiteral('foo')
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
      const given = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          classProperty(
            babelIdentifier('staticProperty'),
            babelStringLiteral('foo'),
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
      const given = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          {
            ...tsDeclareMethod([], babelIdentifier('myMethod'), null, []),
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
      const given = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          classMethod(
            'constructor',
            babelIdentifier('constructor'),
            [
              {
                ...tsParameterProperty(babelIdentifier('publicProperty')),
                accessibility: 'public',
              },
            ],
            babelBlockStatement([])
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
      const given = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          classMethod(
            'constructor',
            babelIdentifier('constructor'),
            [
              {
                ...tsParameterProperty({
                  ...babelIdentifier('publicProperty'),
                  typeAnnotation: tsTypeAnnotation(tsStringKeyword()),
                }),
                accessibility: 'public',
              },
            ],
            babelBlockStatement([])
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
      const given = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          classMethod(
            'constructor',
            babelIdentifier('constructor'),
            [
              {
                ...tsParameterProperty(
                  assignmentPattern(
                    babelIdentifier('publicProperty'),
                    babelStringLiteral('foo')
                  )
                ),
                accessibility: 'public',
              },
            ],
            babelBlockStatement([])
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
      const given = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          classMethod(
            'constructor',
            babelIdentifier('constructor'),
            [
              {
                ...tsParameterProperty(
                  assignmentPattern(
                    {
                      ...babelIdentifier('publicProperty'),
                      typeAnnotation: tSTypeAnnotation(
                        tSUnionType([tsStringKeyword(), tSNumberKeyword()])
                      ),
                    },
                    babelStringLiteral('foo')
                  )
                ),
                accessibility: 'public',
              },
            ],
            babelBlockStatement([])
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
            callExpression(identifier('setmetatable'), [
              tableConstructor(),
              tableConstructor([
                tableNameKeyField(
                  identifier('__index'),
                  identifier('BaseClass')
                ),
              ]),
            ])
          ),
        ]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [memberExpression(identifier('SubClass'), '.', identifier('__index'))],
        [identifier('SubClass')]
      ),
    ];

    it('should convert class', () => {
      const given = classDeclaration(
        babelIdentifier('SubClass'),
        babelIdentifier('BaseClass'),
        classBody([])
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
        ...classDeclaration(
          babelIdentifier('SubClass'),
          babelIdentifier('BaseClass'),
          classBody([])
        ),
        typeParameters: tSTypeParameterDeclaration([
          tsTypeParameter(null, null, 'T'),
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

      expect(statementHandler.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert generic class with generic type params with default types', () => {
      const given = {
        ...classDeclaration(
          babelIdentifier('SubClass'),
          babelIdentifier('BaseClass'),
          classBody([])
        ),
        typeParameters: tSTypeParameterDeclaration([
          tsTypeParameter(null, tsStringKeyword(), 'T'),
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
      const given: ClassDeclaration = {
        ...classDeclaration(
          babelIdentifier('SubClass'),
          babelIdentifier('BaseClass'),
          classBody([])
        ),
        typeParameters: tSTypeParameterDeclaration([
          tsTypeParameter(null, null, 'T'),
          tsTypeParameter(null, null, 'V'),
        ]),
        superTypeParameters: tsTypeParameterInstantiation([
          tsTypeReference(babelIdentifier('V')),
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
      const given: ClassDeclaration = {
        ...classDeclaration(
          babelIdentifier('SubClass'),
          babelIdentifier('BaseClass'),
          classBody([])
        ),
        typeParameters: babelTypeParameterDeclaration([
          { ...babelTypeParameter(), name: 'T' },
          { ...babelTypeParameter(), name: 'V' },
        ]),
        superTypeParameters: babelTypeParameterInstantiation([
          genericTypeAnnotation(babelIdentifier('V')),
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
      const given = classDeclaration(
        babelIdentifier('SubClass'),
        babelIdentifier('BaseClass'),
        classBody([
          classMethod(
            'constructor',
            babelIdentifier('constructor'),
            [],
            babelBlockStatement([])
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
      const given = classDeclaration(
        babelIdentifier('SubClass'),
        babelIdentifier('BaseClass'),
        classBody([
          classMethod(
            'method',
            babelIdentifier('myMethod'),
            [],
            babelBlockStatement([])
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
      const given = classDeclaration(
        babelIdentifier('SubClass'),
        babelIdentifier('BaseClass'),
        classBody([
          classMethod(
            'method',
            babelIdentifier('myStaticMethod'),
            [],
            babelBlockStatement([]),
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
      const given = classDeclaration(
        babelIdentifier('SubClass'),
        babelIdentifier('BaseClass'),
        classBody([
          classProperty(
            babelIdentifier('staticProperty'),
            babelStringLiteral('foo'),
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
