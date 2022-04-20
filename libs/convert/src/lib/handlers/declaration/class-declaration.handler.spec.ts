import {
  blockStatement as babelBlockStatement,
  classBody,
  classDeclaration,
  ClassDeclaration,
  classMethod,
  classProperty,
  identifier as babelIdentifier,
  stringLiteral as babelStringLiteral,
  tsDeclareMethod,
  tsStringKeyword,
  tsTypeAnnotation,
  tsVoidKeyword,
  returnStatement as babelReturnStatement,
} from '@babel/types';
import {
  selfIdentifier,
  withClassDeclarationExtra,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  expressionStatement,
  functionDeclaration,
  identifier,
  LuaNodeGroup,
  memberExpression,
  nodeGroup,
  returnStatement,
  stringLiteral,
  tableConstructor,
  tableNameKeyField,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeLiteral,
  typePropertySignature,
  typeString,
  typeVoid,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  typeReference,
  typeCastExpression,
} from '@js-to-lua/lua-types';
import { handleStatement } from '../expression-statement.handler';

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
      const given: ClassDeclaration = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([])
      );

      const expected: LuaNodeGroup = withClassDeclarationExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
            `ROBLOX TODO: replace 'any' type/ add missing`
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
            typeAnnotation(typeReference(identifier('BaseClass'))),
            false
          ),
        ])
      );

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert class constructor to <ClassId>.new function', () => {
      const given: ClassDeclaration = classDeclaration(
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

      const expected: LuaNodeGroup = withClassDeclarationExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
            `ROBLOX TODO: replace 'any' type/ add missing`
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
            typeAnnotation(typeReference(identifier('BaseClass'))),
            false
          ),
        ])
      );

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert class methods to <ClassId>:<methodName> function', () => {
      const given: ClassDeclaration = classDeclaration(
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

      const expected: LuaNodeGroup = withClassDeclarationExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(
              identifier('BaseClass'),
              typeLiteral([
                typePropertySignature(
                  identifier('myMethod'),
                  typeAnnotation(typeAny())
                ),
              ])
            ),
            `ROBLOX TODO: replace 'any' type/ add missing`
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
            typeAnnotation(typeReference(identifier('BaseClass'))),
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

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert class methods to <ClassId>:<methodName> function with an explicit void return type', () => {
      const given: ClassDeclaration = classDeclaration(
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

      const expected: LuaNodeGroup = withClassDeclarationExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(
              identifier('BaseClass'),
              typeLiteral([
                typePropertySignature(
                  identifier('myMethod'),
                  typeAnnotation(typeAny())
                ),
              ])
            ),
            `ROBLOX TODO: replace 'any' type/ add missing`
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
            typeAnnotation(typeReference(identifier('BaseClass'))),
            false
          ),
          functionDeclaration(
            identifier('BaseClass:myMethod'),
            [],
            nodeGroup([]),
            typeAnnotation(typeVoid()),
            false
          ),
        ])
      );

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert class methods to <ClassId>:<methodName> function with an explicit string return type', () => {
      const given: ClassDeclaration = classDeclaration(
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

      const expected: LuaNodeGroup = withClassDeclarationExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(
              identifier('BaseClass'),
              typeLiteral([
                typePropertySignature(
                  identifier('myMethod'),
                  typeAnnotation(typeAny())
                ),
              ])
            ),
            `ROBLOX TODO: replace 'any' type/ add missing`
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
            typeAnnotation(typeReference(identifier('BaseClass'))),
            false
          ),
          functionDeclaration(
            identifier('BaseClass:myMethod'),
            [],
            nodeGroup([nodeGroup([returnStatement(stringLiteral('foo'))])]),
            typeAnnotation(typeString()),
            false
          ),
        ])
      );

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert static class methods to <ClassId>.<methodName> function', () => {
      const given: ClassDeclaration = classDeclaration(
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

      const expected: LuaNodeGroup = withClassDeclarationExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
            `ROBLOX TODO: replace 'any' type/ add missing`
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
            typeAnnotation(typeReference(identifier('BaseClass'))),
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

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert static properties to <ClassId>.<property>', () => {
      const given: ClassDeclaration = classDeclaration(
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

      const expected: LuaNodeGroup = withClassDeclarationExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
            `ROBLOX TODO: replace 'any' type/ add missing`
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
            typeAnnotation(typeReference(identifier('BaseClass'))),
            false
          ),
        ])
      );

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert class abstract methods to <ClassId>:<methodName> function', () => {
      const given: ClassDeclaration = classDeclaration(
        babelIdentifier('BaseClass'),
        null,
        classBody([
          {
            ...tsDeclareMethod([], babelIdentifier('myMethod'), null, []),
            abstract: true,
          },
        ])
      );

      const expected: LuaNodeGroup = withClassDeclarationExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(
              identifier('BaseClass'),
              typeLiteral([
                typePropertySignature(
                  identifier('myMethod'),
                  typeAnnotation(typeAny())
                ),
              ])
            ),
            `ROBLOX TODO: replace 'any' type/ add missing`
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
            typeAnnotation(typeReference(identifier('BaseClass'))),
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

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
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
      const given: ClassDeclaration = classDeclaration(
        babelIdentifier('SubClass'),
        babelIdentifier('BaseClass'),
        classBody([])
      );

      const expected: LuaNodeGroup = withClassDeclarationExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('SubClass'), typeLiteral([])),
            `ROBLOX TODO: replace 'any' type/ add missing`
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
            typeAnnotation(typeReference(identifier('SubClass'))),
            false
          ),
        ])
      );

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert class constructor to <ClassId>.new function', () => {
      const given: ClassDeclaration = classDeclaration(
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

      const expected: LuaNodeGroup = withClassDeclarationExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('SubClass'), typeLiteral([])),
            `ROBLOX TODO: replace 'any' type/ add missing`
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
            typeAnnotation(typeReference(identifier('SubClass'))),
            false
          ),
        ])
      );

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert class methods to <ClassId>:<methodName> function', () => {
      const given: ClassDeclaration = classDeclaration(
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

      const expected: LuaNodeGroup = withClassDeclarationExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(
              identifier('SubClass'),
              typeLiteral([
                typePropertySignature(
                  identifier('myMethod'),
                  typeAnnotation(typeAny())
                ),
              ])
            ),
            `ROBLOX TODO: replace 'any' type/ add missing`
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
            typeAnnotation(typeReference(identifier('SubClass'))),
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

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });
    it('should convert static class methods to <ClassId>.<methodName> function', () => {
      const given: ClassDeclaration = classDeclaration(
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

      const expected: LuaNodeGroup = withClassDeclarationExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('SubClass'), typeLiteral([])),
            `ROBLOX TODO: replace 'any' type/ add missing`
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
            typeAnnotation(typeReference(identifier('SubClass'))),
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

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should convert static properties to <ClassId>.<property>', () => {
      const given: ClassDeclaration = classDeclaration(
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

      const expected: LuaNodeGroup = withClassDeclarationExtra(
        nodeGroup([
          withTrailingConversionComment(
            typeAliasDeclaration(identifier('SubClass'), typeLiteral([])),
            `ROBLOX TODO: replace 'any' type/ add missing`
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
            typeAnnotation(typeReference(identifier('SubClass'))),
            false
          ),
        ])
      );

      expect(handleStatement.handler(source, {}, given)).toEqual(expected);
    });
  });
});
