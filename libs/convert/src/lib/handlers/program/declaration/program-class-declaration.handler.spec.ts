import {
  selfIdentifier,
  withAnyLeadingConversionComments,
  withAnyTrailingConversionComment,
  withLeadingComments,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  booleanLiteral,
  callExpression,
  expressionStatement,
  functionDeclaration,
  functionDeclarationMultipleReturn,
  functionReturnType,
  functionParamName,
  identifier,
  memberExpression,
  nodeGroup,
  numericLiteral,
  program,
  returnStatement,
  stringLiteral,
  tableConstructor,
  tableNameKeyField,
  tableNoKeyField,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeBoolean,
  typeCastExpression,
  typeFunction,
  typeIntersection,
  typeLiteral,
  typeNumber,
  typeParameterDeclaration,
  typePropertySignature,
  typeReference,
  typeString,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  commentLine,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

const source = '';

describe('Program handler', () => {
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
      ];

      it('should convert class', () => {
        const given = getProgramNode(`
          class BaseClass {}
        `);

        const expected = program([
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert generic class', () => {
        const given = getProgramNode(`
          class BaseClass<T> {}
        `);

        const expected = program([
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
                        typeParameterDeclaration([
                          typeReference(identifier('T')),
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
              typeParameterDeclaration([typeReference(identifier('T'))])
            ),
          ]),
        ]);

        const actual = handleProgram.handler(source, {}, given);
        expect(actual).toEqual(expected);
      });

      it('should convert generic class with explicit constructor', () => {
        const given = getProgramNode(`
          class BaseClass<T> {
            constructor() {}
          }
        `);

        const expected = program([
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
                        typeParameterDeclaration([
                          typeReference(identifier('T')),
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
              typeParameterDeclaration([typeReference(identifier('T'))])
            ),
          ]),
        ]);

        const actual = handleProgram.handler(source, {}, given);
        expect(actual).toEqual(expected);
      });

      it('should convert class constructor to <ClassId>.new function', () => {
        const given = getProgramNode(`
          class BaseClass{
            constructor(){}
          }
        `);

        const expected = program([
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
                  [variableDeclaratorIdentifier(identifier('self'))],
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class methods to <ClassId>:<methodName> function', () => {
        const given = getProgramNode(`
        class BaseClass{
            myMethod(){}
        }
       `);

        const expected = program([
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class methods to <ClassId>:<methodName> function with explicit return type', () => {
        const given = getProgramNode(`
        class BaseClass{
            myMethod(): void {}
        }
       `);

        const expected = program([
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class methods to <ClassId>:<methodName> function with params and explicit return type', () => {
        const given = getProgramNode(`
        class BaseClass{
            myMethod(p1: string, p2: number): void {}
        }
       `);

        const expected = program([
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
                        functionParamName(identifier('p1'), typeString()),
                        functionParamName(identifier('p2'), typeNumber()),
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
              [
                identifier('p1', typeAnnotation(typeString())),
                identifier('p2', typeAnnotation(typeNumber())),
              ],
              nodeGroup([]),
              functionReturnType([]),
              false
            ),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert static class methods to <ClassId>.<methodName> function', () => {
        const given = getProgramNode(`
        class BaseClass{
            static myStaticMethod(){}
        }
       `);

        const expected = program([
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert static properties to <ClassId>.<property>', () => {
        const given = getProgramNode(`
        class BaseClass{
            static staticProperty = "foo"
        }
       `);

        const expected = program([
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class abstract methods to <ClassId>:<methodName> function', () => {
        const given = getProgramNode(`
        abstract class BaseClass{
            abstract myMethod();
        }
       `);

        const expected = program([
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class abstract methods to <ClassId>:<methodName> function with explicit return type', () => {
        const given = getProgramNode(`
        abstract class BaseClass{
            abstract myMethod(): string;
        }
       `);

        const expected = program([
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
              nodeGroup([
                expressionStatement(
                  callExpression(identifier('error'), [
                    stringLiteral('not implemented abstract method'),
                  ])
                ),
              ]),
              typeString(),
              false
            ),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class abstract methods to <ClassId>:<methodName> function with params and explicit return type', () => {
        const given = getProgramNode(`
        abstract class BaseClass{
            abstract myMethod(p1: number, p2: boolean): string;
        }
       `);

        const expected = program([
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
                        functionParamName(identifier('p1'), typeNumber()),
                        functionParamName(identifier('p2'), typeBoolean()),
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
              [
                identifier('p1', typeAnnotation(typeNumber())),
                identifier('p2', typeAnnotation(typeBoolean())),
              ],
              nodeGroup([
                expressionStatement(
                  callExpression(identifier('error'), [
                    stringLiteral('not implemented abstract method'),
                  ])
                ),
              ]),
              typeString(),
              false
            ),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class properties without explicit typing', () => {
        const given = getProgramNode(`
        class BaseClass{
            property
        }
       `);

        const expected = program([
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass'),
              typeLiteral([
                typePropertySignature(
                  identifier('property'),
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class properties with explicit typing', () => {
        const given = getProgramNode(`
        class BaseClass{
            property: string
        }
       `);

        const expected = program([
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass'),
              typeLiteral([
                typePropertySignature(
                  identifier('property'),
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class properties without explicit typing and with inferrable assignment - string', () => {
        const given = getProgramNode(`
        class BaseClass{
            property = 'some string'
        }
       `);

        const expected = program([
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass'),
              typeLiteral([
                typePropertySignature(
                  identifier('property'),
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
                      identifier('property')
                    ),
                  ],
                  [stringLiteral('some string')]
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class properties without explicit typing and with inferrable assignment - boolean', () => {
        const given = getProgramNode(`
        class BaseClass{
            property = true
        }
       `);

        const expected = program([
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass'),
              typeLiteral([
                typePropertySignature(
                  identifier('property'),
                  typeAnnotation(typeBoolean())
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
                      identifier('property')
                    ),
                  ],
                  [booleanLiteral(true)]
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class properties without explicit typing and with inferrable assignment - number', () => {
        const given = getProgramNode(`
        class BaseClass{
            property = 1
        }
       `);

        const expected = program([
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass'),
              typeLiteral([
                typePropertySignature(
                  identifier('property'),
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
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [
                    memberExpression(
                      selfIdentifier(),
                      '.',
                      identifier('property')
                    ),
                  ],
                  [numericLiteral(1, '1')]
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class properties without explicit typing and with inferrable assignment - object', () => {
        const given = getProgramNode(`
        class BaseClass{
            property = {
              someObjProp: foo
            }
        }
       `);

        const expected = program([
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass'),
              typeLiteral([
                typePropertySignature(
                  identifier('property'),
                  typeAnnotation(typeReference(identifier('Object')))
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
                      identifier('property')
                    ),
                  ],
                  [
                    tableConstructor([
                      tableNameKeyField(
                        identifier('someObjProp'),
                        identifier('foo')
                      ),
                    ]),
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class properties without explicit typing and with inferrable assignment - array', () => {
        const given = getProgramNode(`
        class BaseClass{
            property = [foo]
        }
       `);

        const expected = program([
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass'),
              typeLiteral([
                typePropertySignature(
                  identifier('property'),
                  typeAnnotation(
                    typeReference(identifier('Array'), [typeAny()])
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
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [
                    memberExpression(
                      selfIdentifier(),
                      '.',
                      identifier('property')
                    ),
                  ],
                  [tableConstructor([tableNoKeyField(identifier('foo'))])]
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class properties without explicit typing and with non inferrable assignment', () => {
        const given = getProgramNode(`
        class BaseClass{
            property = foo
        }
       `);

        const expected = program([
          nodeGroup([
            typeAliasDeclaration(
              identifier('BaseClass'),
              typeLiteral([
                typePropertySignature(
                  identifier('property'),
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
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [
                    memberExpression(
                      selfIdentifier(),
                      '.',
                      identifier('property')
                    ),
                  ],
                  [identifier('foo')]
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      describe('comments', () => {
        it('should preserve class public method/property comments', () => {
          const given = getProgramNode(`
        class BaseClass {
          /* Comment before foo */
          foo;

          /* Comment before bar */
          bar(){};
        }
      `);

          const expected = program([
            nodeGroup([
              typeAliasDeclaration(
                identifier('BaseClass'),
                typeLiteral([
                  withAnyTrailingConversionComment(
                    withAnyLeadingConversionComments(
                      typePropertySignature(
                        identifier('foo'),
                        typeAnnotation(typeAny())
                      ),
                      'Comment before foo'
                    ),
                    'Comment before bar'
                  ),
                  withAnyLeadingConversionComments(
                    typePropertySignature(
                      identifier('bar'),
                      typeAnnotation(
                        typeFunction(
                          [
                            functionParamName(
                              selfIdentifier(),
                              typeReference(identifier('BaseClass'))
                            ),
                          ],
                          functionReturnType([typeAny()])
                        )
                      )
                    ),
                    'Comment before bar'
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
                identifier('BaseClass:bar'),
                [],
                nodeGroup([]),
                undefined,
                false
              ),
            ]),
          ]);

          const actual = handleProgram.handler(source, {}, given);

          expect(actual).toEqual(expected);
        });
      });

      describe('private members', () => {
        it('should convert class methods to <ClassId>:<methodName> function', () => {
          const given = getProgramNode(`
            class BaseClass{
              private myMethod(){}
            }
          `);

          const expected = program([
            nodeGroup([
              typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
              nodeGroup([
                typeAliasDeclaration(
                  identifier('BaseClass_private'),
                  typeLiteral([
                    withLeadingComments(
                      typePropertySignature(
                        identifier('myMethod'),
                        typeAnnotation(
                          typeFunction(
                            [
                              functionParamName(
                                identifier('self'),
                                typeReference(identifier('BaseClass_private'))
                              ),
                            ],
                            functionReturnType([typeAny()])
                          )
                        )
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
              ...baseClassPrivateExpectedNodes,
              functionDeclaration(
                identifier(`BaseClass_private.new`),
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
                identifier('BaseClass_private:myMethod'),
                [],
                nodeGroup([]),
                undefined,
                false
              ),
            ]),
          ]);

          const actual = handleProgram.handler(source, {}, given);
          expect(actual).toEqual(expected);
        });

        it('should convert static class methods to <ClassId>.<methodName> function', () => {
          const given = getProgramNode(`
            class BaseClass{
              private static myStaticMethod(){}
            }
          `);

          const expected = program([
            nodeGroup([
              typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
              nodeGroup([
                typeAliasDeclaration(
                  identifier('BaseClass_private'),
                  typeLiteral([])
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
                identifier('BaseClass_private.myStaticMethod'),
                [],
                nodeGroup([]),
                undefined,
                false
              ),
            ]),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });

        it('should convert static properties to <ClassId>.<property>', () => {
          const given = getProgramNode(`
            class BaseClass{
              private static staticProperty = "foo"
            }
          `);

          const expected = program([
            nodeGroup([
              typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
              nodeGroup([
                typeAliasDeclaration(
                  identifier('BaseClass_private'),
                  typeLiteral([])
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
                            typeReference(identifier('BaseClass')),
                          ])
                        )
                      )
                    ),
                  ])
                ),
              ]),
              ...baseClassPrivateExpectedNodes,
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    identifier('BaseClass_private'),
                    '.',
                    identifier('staticProperty')
                  ),
                ],
                [stringLiteral('foo')]
              ),
              functionDeclaration(
                identifier(`BaseClass_private.new`),
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
            ]),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });

        it('should convert class properties without explicit typing', () => {
          const given = getProgramNode(`
            class BaseClass{
              private property
            }
          `);

          const expected = program([
            nodeGroup([
              typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
              nodeGroup([
                typeAliasDeclaration(
                  identifier('BaseClass_private'),
                  typeLiteral([
                    withLeadingComments(
                      typePropertySignature(
                        identifier('property'),
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
              ...baseClassPrivateExpectedNodes,
              functionDeclaration(
                identifier(`BaseClass_private.new`),
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
            ]),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });

        it('should convert class properties with explicit typing', () => {
          const given = getProgramNode(`
            class BaseClass{
              private property: string
            }
          `);

          const expected = program([
            nodeGroup([
              typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
              nodeGroup([
                typeAliasDeclaration(
                  identifier('BaseClass_private'),
                  typeLiteral([
                    withLeadingComments(
                      typePropertySignature(
                        identifier('property'),
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
              ...baseClassPrivateExpectedNodes,
              functionDeclaration(
                identifier(`BaseClass_private.new`),
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
            ]),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
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
      ];
      const subClassPrivateExpectedNodes = [
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
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('SubClass_private'))],
          [
            variableDeclaratorValue(
              typeCastExpression(
                identifier('SubClass'),
                typeIntersection([
                  typeReference(identifier('SubClass_private')),
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
      const subClassPrivateGenericExpectedNodes = [
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
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('SubClass_private'))],
          [
            variableDeclaratorValue(
              typeCastExpression(
                identifier('SubClass'),
                typeIntersection([
                  typeReference(identifier('SubClass_private'), [
                    typeAny(),
                    typeAny(),
                  ]),
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
        const given = getProgramNode(`
        class SubClass extends BaseClass{}
       `);

        const expected = program([
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class constructor to <ClassId>.new function', () => {
        const given = getProgramNode(`
        class SubClass extends BaseClass{
            constructor(){}
        }
       `);

        const expected = program([
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
                    [variableDeclaratorIdentifier(identifier('self'))],
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class methods to <ClassId>:<methodName> function', () => {
        const given = getProgramNode(`
        class SubClass extends BaseClass{
            myMethod(){}
        }
       `);

        const expected = program([
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert static class methods to <ClassId>.<methodName> function', () => {
        const given = getProgramNode(`
        class SubClass extends BaseClass{
            static myStaticMethod(){}
        }
       `);

        const expected = program([
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert static properties to <ClassId>.<property>', () => {
        const given = getProgramNode(`
        class SubClass extends BaseClass{
            static staticProperty = "foo"
        }
       `);

        const expected = program([
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      describe('private members', () => {
        it('should convert class methods to <ClassId>:<methodName> function', () => {
          const given = getProgramNode(`
            class SubClass extends BaseClass{
                private myMethod(){}
            }
          `);

          const expected = program([
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
                  identifier('SubClass_private'),
                  typeIntersection([
                    typeReference(identifier('BaseClass')),
                    typeLiteral([
                      withLeadingComments(
                        typePropertySignature(
                          identifier('myMethod'),
                          typeAnnotation(
                            typeFunction(
                              [
                                functionParamName(
                                  identifier('self'),
                                  typeReference(identifier('SubClass_private'))
                                ),
                              ],
                              functionReturnType([typeAny()])
                            )
                          )
                        ),
                        commentLine(''),
                        commentLine(' *** PRIVATE *** '),
                        commentLine('')
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
                          functionReturnType([
                            typeReference(identifier('SubClass')),
                          ])
                        )
                      )
                    ),
                  ])
                ),
              ]),
              ...subClassPrivateExpectedNodes,
              functionDeclaration(
                identifier(`SubClass_private.new`),
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
                identifier('SubClass_private:myMethod'),
                [],
                nodeGroup([]),
                undefined,
                false
              ),
            ]),
          ]);

          const actual = handleProgram.handler(source, {}, given);
          expect(actual).toEqual(expected);
        });

        it('should convert static class methods to <ClassId>.<methodName> function', () => {
          const given = getProgramNode(`
            class SubClass extends BaseClass{
                private static myStaticMethod(){}
            }
          `);

          const expected = program([
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
                  identifier('SubClass_private'),
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
                          functionReturnType([
                            typeReference(identifier('SubClass')),
                          ])
                        )
                      )
                    ),
                  ])
                ),
              ]),
              ...subClassPrivateExpectedNodes,
              functionDeclaration(
                identifier(`SubClass_private.new`),
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
                identifier('SubClass_private.myStaticMethod'),
                [],
                nodeGroup([]),
                undefined,
                false
              ),
            ]),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });

        it('should convert static properties to <ClassId>.<property>', () => {
          const given = getProgramNode(`
            class SubClass extends BaseClass{
                private static staticProperty = "foo"
            }
          `);

          const expected = program([
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
                  identifier('SubClass_private'),
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
                          functionReturnType([
                            typeReference(identifier('SubClass')),
                          ])
                        )
                      )
                    ),
                  ])
                ),
              ]),
              ...subClassPrivateExpectedNodes,
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    identifier('SubClass_private'),
                    '.',
                    identifier('staticProperty')
                  ),
                ],
                [stringLiteral('foo')]
              ),
              functionDeclaration(
                identifier(`SubClass_private.new`),
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
            ]),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        });

        it('should convert generic class with private properties', () => {
          const given = getProgramNode(`
            class SubClass<T, U> extends BaseClass<U> {
                private privateProperty
            }
          `);

          const expected = program([
            nodeGroup([
              typeAliasDeclaration(
                identifier('SubClass'),
                typeIntersection([
                  typeReference(identifier('BaseClass'), [
                    typeReference(identifier('U')),
                  ]),
                  typeLiteral([]),
                ]),
                typeParameterDeclaration([
                  typeReference(identifier('T')),
                  typeReference(identifier('U')),
                ])
              ),
              nodeGroup([
                typeAliasDeclaration(
                  identifier('SubClass_private'),
                  typeIntersection([
                    typeReference(identifier('BaseClass'), [
                      typeReference(identifier('U')),
                    ]),
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
                    ]),
                  ]),
                  typeParameterDeclaration([
                    typeReference(identifier('T')),
                    typeReference(identifier('U')),
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
                              typeReference(identifier('U')),
                            ]),
                          ]),
                          typeParameterDeclaration([
                            typeReference(identifier('T')),
                            typeReference(identifier('U')),
                          ])
                        )
                      )
                    ),
                  ])
                ),
              ]),
              ...subClassPrivateGenericExpectedNodes,
              functionDeclaration(
                identifier(`SubClass_private.new`),
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
                        typeReference(identifier('U')),
                      ])
                    )
                  ),
                ]),
                typeReference(identifier('SubClass'), [
                  typeReference(identifier('T')),
                  typeReference(identifier('U')),
                ]),
                false,
                typeParameterDeclaration([
                  typeReference(identifier('T')),
                  typeReference(identifier('U')),
                ])
              ),
            ]),
          ]);

          const actual = handleProgram.handler(source, {}, given);
          expect(actual).toEqual(expected);
        });
      });
    });
  });
});
