import {
  selfIdentifier,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  booleanLiteral,
  callExpression,
  expressionStatement,
  functionDeclaration,
  functionTypeParam,
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
  typeLiteral,
  typeNumber,
  typePropertySignature,
  typeReference,
  typeString,
  typeVoid,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
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
          [variableDeclaratorValue(tableConstructor())]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [
            memberExpression(
              identifier('BaseClass'),
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
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
              typeAnnotation(typeReference(identifier('BaseClass'))),
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
                        functionTypeParam(
                          identifier('self'),
                          typeReference(identifier('BaseClass'))
                        ),
                      ],
                      typeAny()
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
                        functionTypeParam(
                          identifier('self'),
                          typeReference(identifier('BaseClass'))
                        ),
                      ],
                      typeVoid()
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
                        functionTypeParam(
                          identifier('self'),
                          typeReference(identifier('BaseClass'))
                        ),
                        functionTypeParam(identifier('p1'), typeString()),
                        functionTypeParam(identifier('p2'), typeNumber()),
                      ],
                      typeVoid()
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
              typeAnnotation(typeReference(identifier('BaseClass'))),
              false
            ),
            functionDeclaration(
              identifier('BaseClass:myMethod'),
              [
                identifier('p1', typeAnnotation(typeString())),
                identifier('p2', typeAnnotation(typeNumber())),
              ],
              nodeGroup([]),
              typeAnnotation(typeVoid()),
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
                        functionTypeParam(
                          identifier('self'),
                          typeReference(identifier('BaseClass'))
                        ),
                      ],
                      typeAny()
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
                        functionTypeParam(
                          identifier('self'),
                          typeReference(identifier('BaseClass'))
                        ),
                      ],
                      typeString()
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
              typeAnnotation(typeString()),
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
                        functionTypeParam(
                          identifier('self'),
                          typeReference(identifier('BaseClass'))
                        ),
                        functionTypeParam(identifier('p1'), typeNumber()),
                        functionTypeParam(identifier('p2'), typeBoolean()),
                      ],
                      typeString()
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
              typeAnnotation(typeReference(identifier('BaseClass'))),
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
              typeAnnotation(typeString()),
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
              typeAnnotation(typeReference(identifier('BaseClass'))),
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
              typeAnnotation(typeReference(identifier('BaseClass'))),
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
              typeAnnotation(typeReference(identifier('BaseClass'))),
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
              typeAnnotation(typeReference(identifier('BaseClass'))),
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
              typeAnnotation(typeReference(identifier('BaseClass'))),
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
              typeAnnotation(typeReference(identifier('BaseClass'))),
              false
            ),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
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
          [
            memberExpression(
              identifier('SubClass'),
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
            typeAliasDeclaration(identifier('SubClass'), typeLiteral([])),
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
            typeAliasDeclaration(identifier('SubClass'), typeLiteral([])),
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
              typeAnnotation(typeReference(identifier('SubClass'))),
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
              typeLiteral([
                typePropertySignature(
                  identifier('myMethod'),
                  typeAnnotation(
                    typeFunction(
                      [
                        functionTypeParam(
                          identifier('self'),
                          typeReference(identifier('SubClass'))
                        ),
                      ],
                      typeAny()
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
            typeAliasDeclaration(identifier('SubClass'), typeLiteral([])),
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
            typeAliasDeclaration(identifier('SubClass'), typeLiteral([])),
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
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });
  });
});
