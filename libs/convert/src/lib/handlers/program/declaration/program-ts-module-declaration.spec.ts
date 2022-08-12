import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  blockStatement,
  callExpression,
  exportTypeStatement,
  functionDeclaration,
  functionParamName,
  functionReturnType,
  identifier,
  memberExpression,
  nilLiteral,
  nodeGroup,
  program,
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
  typePropertySignature,
  typeQuery,
  typeReference,
  typeString,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('TS Module Declaration', () => {
    describe('not exported namespace', () => {
      it('should handle empty namespace', () => {
        const given = getProgramNode(`
          namespace Empty {}
        `);
        const expected = program([
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Empty'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle namespace with type', () => {
        const given = getProgramNode(`
          namespace Foo {
            type Bar = { bar: string }
          }
        `);
        const expected = program([
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            blockStatement([
              typeAliasDeclaration(
                identifier('Bar'),
                typeLiteral([
                  typePropertySignature(
                    identifier('bar'),
                    typeAnnotation(typeString())
                  ),
                ])
              ),
            ]),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle namespace with type - exported', () => {
        const given = getProgramNode(`
          namespace Foo {
            export type Bar = { bar: string }
          }
        `);
        const expected = program([
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            typeAliasDeclaration(
              identifier('Foo_Bar'),
              typeLiteral([
                typePropertySignature(
                  identifier('bar'),
                  typeAnnotation(typeString())
                ),
              ])
            ),
            blockStatement([
              typeAliasDeclaration(
                identifier('Bar'),
                typeReference(identifier('Foo_Bar'))
              ),
            ]),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it.each([
        `
          namespace Foo {
            function bar() {}
          }
        `,
        `
          namespace Foo {
            const bar = function () {}
          }
        `,
        `
          namespace Foo {
            const bar = () => {}
          }
        `,
      ])('should handle namespace with function declaration: %s', (code) => {
        const given = getProgramNode(code);
        const expected = program([
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            blockStatement([functionDeclaration(identifier('bar'))]),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it.each([
        `
          namespace Foo {
            export function bar() {}
          }
        `,
        `
          namespace Foo {
            export const bar = function() {}
          }
        `,
        `
          namespace Foo {
            export const bar = () => {}
          }
        `,
      ])(
        'should handle namespace with function declaration - exported %s',
        (code) => {
          const given = getProgramNode(code);
          const expected = program([
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(identifier('Foo'))],
                [variableDeclaratorValue(tableConstructor())]
              ),
              blockStatement([
                functionDeclaration(identifier('bar')),
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [memberExpression(identifier('Foo'), '.', identifier('bar'))],
                  [identifier('bar')]
                ),
              ]),
            ]),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        }
      );

      it('should handle namespace with type and function declaration', () => {
        const given = getProgramNode(`
          namespace Foo {
            type Bar = { bar: string }
            function bar() {}
          }
        `);
        const expected = program([
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            blockStatement([
              typeAliasDeclaration(
                identifier('Bar'),
                typeLiteral([
                  typePropertySignature(
                    identifier('bar'),
                    typeAnnotation(typeString())
                  ),
                ])
              ),
              functionDeclaration(identifier('bar')),
            ]),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle namespace with type and function declaration - exported', () => {
        const given = getProgramNode(`
          namespace Foo {
            export type Bar = { bar: string }
            export function bar() {}
          }
        `);
        const expected = program([
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            typeAliasDeclaration(
              identifier('Foo_Bar'),
              typeLiteral([
                typePropertySignature(
                  identifier('bar'),
                  typeAnnotation(typeString())
                ),
              ])
            ),
            blockStatement([
              typeAliasDeclaration(
                identifier('Bar'),
                typeReference(identifier('Foo_Bar'))
              ),
              functionDeclaration(identifier('bar')),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [memberExpression(identifier('Foo'), '.', identifier('bar'))],
                [identifier('bar')]
              ),
            ]),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle namespace with type and variable declaration', () => {
        const given = getProgramNode(`
          namespace Foo {
            type Bar = { bar: string }
            const bar: Bar = { bar: 'bar' }
          }
        `);
        const expected = program([
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            blockStatement([
              typeAliasDeclaration(
                identifier('Bar'),
                typeLiteral([
                  typePropertySignature(
                    identifier('bar'),
                    typeAnnotation(typeString())
                  ),
                ])
              ),
              variableDeclaration(
                [
                  variableDeclaratorIdentifier(
                    identifier(
                      'bar',
                      typeAnnotation(typeReference(identifier('Bar')))
                    )
                  ),
                ],
                [
                  variableDeclaratorValue(
                    tableConstructor([
                      tableNameKeyField(
                        identifier('bar'),
                        stringLiteral('bar')
                      ),
                    ])
                  ),
                ]
              ),
            ]),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle namespace with type and variable declaration - exported', () => {
        const given = getProgramNode(`
          namespace Foo {
            export type Bar = { bar: string }
            export const bar: Bar = { bar: 'bar' }
          }
        `);
        const expected = program([
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            typeAliasDeclaration(
              identifier('Foo_Bar'),
              typeLiteral([
                typePropertySignature(
                  identifier('bar'),
                  typeAnnotation(typeString())
                ),
              ])
            ),
            blockStatement([
              typeAliasDeclaration(
                identifier('Bar'),
                typeReference(identifier('Foo_Bar'))
              ),
              variableDeclaration(
                [
                  variableDeclaratorIdentifier(
                    identifier(
                      'bar',
                      typeAnnotation(typeReference(identifier('Bar')))
                    )
                  ),
                ],
                [
                  variableDeclaratorValue(
                    tableConstructor([
                      tableNameKeyField(
                        identifier('bar'),
                        stringLiteral('bar')
                      ),
                    ])
                  ),
                ]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [memberExpression(identifier('Foo'), '.', identifier('bar'))],
                [identifier('bar')]
              ),
            ]),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle namespace with class declaration', () => {
        const given = getProgramNode(`
          namespace Foo {
            class Bar {
              property: string;
              method(): Bar {
                return this
              }
            }
          }
        `);
        const expected = program([
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            blockStatement([
              nodeGroup([
                typeAliasDeclaration(
                  identifier('Bar'),
                  typeLiteral([
                    typePropertySignature(
                      identifier('property'),
                      typeAnnotation(typeString())
                    ),
                    typePropertySignature(
                      identifier('method'),
                      typeAnnotation(
                        typeFunction(
                          [
                            functionParamName(
                              identifier('self'),
                              typeReference(identifier('Bar'))
                            ),
                          ],
                          functionReturnType([typeReference(identifier('Bar'))])
                        )
                      )
                    ),
                  ])
                ),
                typeAliasDeclaration(
                  identifier('Bar_statics'),
                  typeLiteral([
                    typePropertySignature(
                      identifier('new'),
                      typeAnnotation(
                        typeFunction(
                          [],
                          functionReturnType([typeReference(identifier('Bar'))])
                        )
                      )
                    ),
                  ])
                ),
                variableDeclaration(
                  [variableDeclaratorIdentifier(identifier('Bar'))],
                  [
                    variableDeclaratorValue(
                      typeCastExpression(
                        tableConstructor(),
                        typeIntersection([
                          typeReference(identifier('Bar')),
                          typeReference(identifier('Bar_statics')),
                        ])
                      )
                    ),
                  ]
                ),
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [
                    memberExpression(
                      typeCastExpression(identifier('Bar'), typeAny()),
                      '.',
                      identifier('__index')
                    ),
                  ],
                  [identifier('Bar')]
                ),
                functionDeclaration(
                  identifier('Bar.new'),
                  [],
                  nodeGroup([
                    variableDeclaration(
                      [variableDeclaratorIdentifier(identifier('self'))],
                      [
                        variableDeclaratorValue(
                          callExpression(identifier('setmetatable'), [
                            tableConstructor(),
                            identifier('Bar'),
                          ])
                        ),
                      ]
                    ),
                    returnStatement(
                      typeCastExpression(
                        typeCastExpression(identifier('self'), typeAny()),
                        typeReference(identifier('Bar'))
                      )
                    ),
                  ]),
                  typeReference(identifier('Bar')),
                  false
                ),
                functionDeclaration(
                  identifier('Bar:method'),
                  [],
                  nodeGroup([nodeGroup([returnStatement(identifier('self'))])]),
                  typeReference(identifier('Bar')),
                  false
                ),
              ]),
            ]),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle namespace with class declaration - exported', () => {
        const given = getProgramNode(`
          namespace Foo {
            export class Bar {
              property: string;
              method(): Bar {
                return this
              }
            }
          }
        `);
        const expected = program([
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('__Foo_Bar__type'))],
              []
            ),
            typeAliasDeclaration(
              identifier('Foo_Bar'),
              typeQuery(identifier('__Foo_Bar__type'))
            ),
            blockStatement([
              typeAliasDeclaration(
                identifier('Bar'),
                typeLiteral([
                  typePropertySignature(
                    identifier('property'),
                    typeAnnotation(typeString())
                  ),
                  typePropertySignature(
                    identifier('method'),
                    typeAnnotation(
                      typeFunction(
                        [
                          functionParamName(
                            identifier('self'),
                            typeReference(identifier('Bar'))
                          ),
                        ],
                        functionReturnType([typeReference(identifier('Bar'))])
                      )
                    )
                  ),
                ])
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [identifier('__Foo_Bar__type')],
                [
                  typeCastExpression(
                    typeCastExpression(nilLiteral(), typeAny()),
                    typeReference(identifier('Bar'))
                  ),
                ]
              ),
              typeAliasDeclaration(
                identifier('Bar_statics'),
                typeLiteral([
                  typePropertySignature(
                    identifier('new'),
                    typeAnnotation(
                      typeFunction(
                        [],
                        functionReturnType([typeReference(identifier('Bar'))])
                      )
                    )
                  ),
                ])
              ),
              variableDeclaration(
                [variableDeclaratorIdentifier(identifier('Bar'))],
                [
                  variableDeclaratorValue(
                    typeCastExpression(
                      tableConstructor(),
                      typeIntersection([
                        typeReference(identifier('Bar')),
                        typeReference(identifier('Bar_statics')),
                      ])
                    )
                  ),
                ]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    typeCastExpression(identifier('Bar'), typeAny()),
                    '.',
                    identifier('__index')
                  ),
                ],
                [identifier('Bar')]
              ),
              functionDeclaration(
                identifier('Bar.new'),
                [],
                nodeGroup([
                  variableDeclaration(
                    [variableDeclaratorIdentifier(identifier('self'))],
                    [
                      variableDeclaratorValue(
                        callExpression(identifier('setmetatable'), [
                          tableConstructor(),
                          identifier('Bar'),
                        ])
                      ),
                    ]
                  ),
                  returnStatement(
                    typeCastExpression(
                      typeCastExpression(identifier('self'), typeAny()),
                      typeReference(identifier('Bar'))
                    )
                  ),
                ]),
                typeReference(identifier('Bar')),
                false
              ),
              functionDeclaration(
                identifier('Bar:method'),
                [],
                nodeGroup([nodeGroup([returnStatement(identifier('self'))])]),
                typeReference(identifier('Bar')),
                false
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [memberExpression(identifier('Foo'), '.', identifier('Bar'))],
                [identifier('Bar')]
              ),
            ]),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle namespace with multiple type and function declarations - exported and not exported', () => {
        const given = getProgramNode(`
          namespace Foo {
            export type Bar = { bar: string }
            export function bar() {}
            type Baz = { baz: string }
            function baz() {}
          }
        `);
        const expected = program([
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            typeAliasDeclaration(
              identifier('Foo_Bar'),
              typeLiteral([
                typePropertySignature(
                  identifier('bar'),
                  typeAnnotation(typeString())
                ),
              ])
            ),
            blockStatement([
              typeAliasDeclaration(
                identifier('Bar'),
                typeReference(identifier('Foo_Bar'))
              ),
              functionDeclaration(identifier('bar')),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [memberExpression(identifier('Foo'), '.', identifier('bar'))],
                [identifier('bar')]
              ),
              typeAliasDeclaration(
                identifier('Baz'),
                typeLiteral([
                  typePropertySignature(
                    identifier('baz'),
                    typeAnnotation(typeString())
                  ),
                ])
              ),
              functionDeclaration(identifier('baz')),
            ]),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });

    describe('exported namespace', () => {
      it('should handle empty namespace', () => {
        const given = getProgramNode(`
          export namespace Empty {}
        `);
        const expected = program([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('exports'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Empty'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [
                memberExpression(
                  identifier('exports'),
                  '.',
                  identifier('Empty')
                ),
              ],
              [identifier('Empty')]
            ),
          ]),
          returnStatement(identifier('exports')),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle namespace with type', () => {
        const given = getProgramNode(`
          export namespace Foo {
            type Bar = { bar: string }
          }
        `);
        const expected = program([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('exports'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            blockStatement([
              typeAliasDeclaration(
                identifier('Bar'),
                typeLiteral([
                  typePropertySignature(
                    identifier('bar'),
                    typeAnnotation(typeString())
                  ),
                ])
              ),
            ]),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [memberExpression(identifier('exports'), '.', identifier('Foo'))],
              [identifier('Foo')]
            ),
          ]),
          returnStatement(identifier('exports')),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle namespace with type - exported', () => {
        const given = getProgramNode(`
          export namespace Foo {
            export type Bar = { bar: string }
          }
        `);
        const expected = program([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('exports'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            blockStatement([
              typeAliasDeclaration(
                identifier('Bar'),
                typeReference(identifier('Foo_Bar'))
              ),
            ]),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [memberExpression(identifier('exports'), '.', identifier('Foo'))],
              [identifier('Foo')]
            ),
            exportTypeStatement(
              typeAliasDeclaration(
                identifier('Foo_Bar'),
                typeLiteral([
                  typePropertySignature(
                    identifier('bar'),
                    typeAnnotation(typeString())
                  ),
                ])
              )
            ),
          ]),
          returnStatement(identifier('exports')),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it.each([
        `
          export namespace Foo {
            function bar() {}
          }
        `,
        `
          export namespace Foo {
            const bar = function () {}
          }
        `,
        `
          export namespace Foo {
            const bar = () => {}
          }
        `,
      ])('should handle namespace with function declaration: %s', (code) => {
        const given = getProgramNode(code);
        const expected = program([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('exports'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            blockStatement([functionDeclaration(identifier('bar'))]),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [memberExpression(identifier('exports'), '.', identifier('Foo'))],
              [identifier('Foo')]
            ),
          ]),
          returnStatement(identifier('exports')),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it.each([
        `
          export namespace Foo {
            export function bar() {}
          }
        `,
        `
          export namespace Foo {
            export const bar = function() {}
          }
        `,
        `
          export namespace Foo {
            export const bar = () => {}
          }
        `,
      ])(
        'should handle namespace with function declaration - exported %s',
        (code) => {
          const given = getProgramNode(code);
          const expected = program([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('exports'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(identifier('Foo'))],
                [variableDeclaratorValue(tableConstructor())]
              ),
              blockStatement([
                functionDeclaration(identifier('bar')),
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [memberExpression(identifier('Foo'), '.', identifier('bar'))],
                  [identifier('bar')]
                ),
              ]),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    identifier('exports'),
                    '.',
                    identifier('Foo')
                  ),
                ],
                [identifier('Foo')]
              ),
            ]),
            returnStatement(identifier('exports')),
          ]);

          expect(handleProgram.handler(source, {}, given)).toEqual(expected);
        }
      );

      it('should handle namespace with type and function declaration', () => {
        const given = getProgramNode(`
          export namespace Foo {
            type Bar = { bar: string }
            function bar() {}
          }
        `);
        const expected = program([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('exports'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            blockStatement([
              typeAliasDeclaration(
                identifier('Bar'),
                typeLiteral([
                  typePropertySignature(
                    identifier('bar'),
                    typeAnnotation(typeString())
                  ),
                ])
              ),
              functionDeclaration(identifier('bar')),
            ]),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [memberExpression(identifier('exports'), '.', identifier('Foo'))],
              [identifier('Foo')]
            ),
          ]),
          returnStatement(identifier('exports')),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle namespace with type and function declaration - exported', () => {
        const given = getProgramNode(`
          export namespace Foo {
            export type Bar = { bar: string }
            export function bar() {}
          }
        `);
        const expected = program([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('exports'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            blockStatement([
              typeAliasDeclaration(
                identifier('Bar'),
                typeReference(identifier('Foo_Bar'))
              ),
              functionDeclaration(identifier('bar')),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [memberExpression(identifier('Foo'), '.', identifier('bar'))],
                [identifier('bar')]
              ),
            ]),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [memberExpression(identifier('exports'), '.', identifier('Foo'))],
              [identifier('Foo')]
            ),
            exportTypeStatement(
              typeAliasDeclaration(
                identifier('Foo_Bar'),
                typeLiteral([
                  typePropertySignature(
                    identifier('bar'),
                    typeAnnotation(typeString())
                  ),
                ])
              )
            ),
          ]),
          returnStatement(identifier('exports')),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle namespace with type and variable declaration', () => {
        const given = getProgramNode(`
          export namespace Foo {
            type Bar = { bar: string }
            const bar: Bar = { bar: 'bar' }
          }
        `);
        const expected = program([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('exports'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            blockStatement([
              typeAliasDeclaration(
                identifier('Bar'),
                typeLiteral([
                  typePropertySignature(
                    identifier('bar'),
                    typeAnnotation(typeString())
                  ),
                ])
              ),
              variableDeclaration(
                [
                  variableDeclaratorIdentifier(
                    identifier(
                      'bar',
                      typeAnnotation(typeReference(identifier('Bar')))
                    )
                  ),
                ],
                [
                  variableDeclaratorValue(
                    tableConstructor([
                      tableNameKeyField(
                        identifier('bar'),
                        stringLiteral('bar')
                      ),
                    ])
                  ),
                ]
              ),
            ]),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [memberExpression(identifier('exports'), '.', identifier('Foo'))],
              [identifier('Foo')]
            ),
          ]),
          returnStatement(identifier('exports')),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle namespace with type and variable declaration - exported', () => {
        const given = getProgramNode(`
          export namespace Foo {
            export type Bar = { bar: string }
            export const bar: Bar = { bar: 'bar' }
          }
        `);
        const expected = program([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('exports'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            blockStatement([
              typeAliasDeclaration(
                identifier('Bar'),
                typeReference(identifier('Foo_Bar'))
              ),
              variableDeclaration(
                [
                  variableDeclaratorIdentifier(
                    identifier(
                      'bar',
                      typeAnnotation(typeReference(identifier('Bar')))
                    )
                  ),
                ],
                [
                  variableDeclaratorValue(
                    tableConstructor([
                      tableNameKeyField(
                        identifier('bar'),
                        stringLiteral('bar')
                      ),
                    ])
                  ),
                ]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [memberExpression(identifier('Foo'), '.', identifier('bar'))],
                [identifier('bar')]
              ),
            ]),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [memberExpression(identifier('exports'), '.', identifier('Foo'))],
              [identifier('Foo')]
            ),
            exportTypeStatement(
              typeAliasDeclaration(
                identifier('Foo_Bar'),
                typeLiteral([
                  typePropertySignature(
                    identifier('bar'),
                    typeAnnotation(typeString())
                  ),
                ])
              )
            ),
          ]),
          returnStatement(identifier('exports')),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle namespace with class declaration', () => {
        const given = getProgramNode(`
          export namespace Foo {
            class Bar {
              property: string;
              method(): Bar {
                return this
              }
            }
          }
        `);
        const expected = program([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('exports'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            blockStatement([
              nodeGroup([
                typeAliasDeclaration(
                  identifier('Bar'),
                  typeLiteral([
                    typePropertySignature(
                      identifier('property'),
                      typeAnnotation(typeString())
                    ),
                    typePropertySignature(
                      identifier('method'),
                      typeAnnotation(
                        typeFunction(
                          [
                            functionParamName(
                              identifier('self'),
                              typeReference(identifier('Bar'))
                            ),
                          ],
                          functionReturnType([typeReference(identifier('Bar'))])
                        )
                      )
                    ),
                  ])
                ),
                typeAliasDeclaration(
                  identifier('Bar_statics'),
                  typeLiteral([
                    typePropertySignature(
                      identifier('new'),
                      typeAnnotation(
                        typeFunction(
                          [],
                          functionReturnType([typeReference(identifier('Bar'))])
                        )
                      )
                    ),
                  ])
                ),
                variableDeclaration(
                  [variableDeclaratorIdentifier(identifier('Bar'))],
                  [
                    variableDeclaratorValue(
                      typeCastExpression(
                        tableConstructor(),
                        typeIntersection([
                          typeReference(identifier('Bar')),
                          typeReference(identifier('Bar_statics')),
                        ])
                      )
                    ),
                  ]
                ),
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [
                    memberExpression(
                      typeCastExpression(identifier('Bar'), typeAny()),
                      '.',
                      identifier('__index')
                    ),
                  ],
                  [identifier('Bar')]
                ),
                functionDeclaration(
                  identifier('Bar.new'),
                  [],
                  nodeGroup([
                    variableDeclaration(
                      [variableDeclaratorIdentifier(identifier('self'))],
                      [
                        variableDeclaratorValue(
                          callExpression(identifier('setmetatable'), [
                            tableConstructor(),
                            identifier('Bar'),
                          ])
                        ),
                      ]
                    ),
                    returnStatement(
                      typeCastExpression(
                        typeCastExpression(identifier('self'), typeAny()),
                        typeReference(identifier('Bar'))
                      )
                    ),
                  ]),
                  typeReference(identifier('Bar')),
                  false
                ),
                functionDeclaration(
                  identifier('Bar:method'),
                  [],
                  nodeGroup([nodeGroup([returnStatement(identifier('self'))])]),
                  typeReference(identifier('Bar')),
                  false
                ),
              ]),
            ]),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [memberExpression(identifier('exports'), '.', identifier('Foo'))],
              [identifier('Foo')]
            ),
          ]),
          returnStatement(identifier('exports')),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should handle namespace with class declaration - exported', () => {
        const given = getProgramNode(`
          export namespace Foo {
            export class BarClass {
              property: string;
              method(): BarClass {
                return this
              }
            }
          }
        `);
        const expected = program([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('exports'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            variableDeclaration(
              [
                variableDeclaratorIdentifier(
                  identifier('__Foo_BarClass__type')
                ),
              ],
              []
            ),
            blockStatement([
              typeAliasDeclaration(
                identifier('BarClass'),
                typeLiteral([
                  typePropertySignature(
                    identifier('property'),
                    typeAnnotation(typeString())
                  ),
                  typePropertySignature(
                    identifier('method'),
                    typeAnnotation(
                      typeFunction(
                        [
                          functionParamName(
                            identifier('self'),
                            typeReference(identifier('BarClass'))
                          ),
                        ],
                        functionReturnType([
                          typeReference(identifier('BarClass')),
                        ])
                      )
                    )
                  ),
                ])
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [identifier('__Foo_BarClass__type')],
                [
                  typeCastExpression(
                    typeCastExpression(nilLiteral(), typeAny()),
                    typeReference(identifier('BarClass'))
                  ),
                ]
              ),
              typeAliasDeclaration(
                identifier('BarClass_statics'),
                typeLiteral([
                  typePropertySignature(
                    identifier('new'),
                    typeAnnotation(
                      typeFunction(
                        [],
                        functionReturnType([
                          typeReference(identifier('BarClass')),
                        ])
                      )
                    )
                  ),
                ])
              ),
              variableDeclaration(
                [variableDeclaratorIdentifier(identifier('BarClass'))],
                [
                  variableDeclaratorValue(
                    typeCastExpression(
                      tableConstructor(),
                      typeIntersection([
                        typeReference(identifier('BarClass')),
                        typeReference(identifier('BarClass_statics')),
                      ])
                    )
                  ),
                ]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    typeCastExpression(identifier('BarClass'), typeAny()),
                    '.',
                    identifier('__index')
                  ),
                ],
                [identifier('BarClass')]
              ),
              functionDeclaration(
                identifier('BarClass.new'),
                [],
                nodeGroup([
                  variableDeclaration(
                    [variableDeclaratorIdentifier(identifier('self'))],
                    [
                      variableDeclaratorValue(
                        callExpression(identifier('setmetatable'), [
                          tableConstructor(),
                          identifier('BarClass'),
                        ])
                      ),
                    ]
                  ),
                  returnStatement(
                    typeCastExpression(
                      typeCastExpression(identifier('self'), typeAny()),
                      typeReference(identifier('BarClass'))
                    )
                  ),
                ]),
                typeReference(identifier('BarClass')),
                false
              ),
              functionDeclaration(
                identifier('BarClass:method'),
                [],
                nodeGroup([nodeGroup([returnStatement(identifier('self'))])]),
                typeReference(identifier('BarClass')),
                false
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    identifier('Foo'),
                    '.',
                    identifier('BarClass')
                  ),
                ],
                [identifier('BarClass')]
              ),
            ]),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [memberExpression(identifier('exports'), '.', identifier('Foo'))],
              [identifier('Foo')]
            ),
            exportTypeStatement(
              typeAliasDeclaration(
                identifier('Foo_BarClass'),
                typeQuery(identifier('__Foo_BarClass__type'))
              )
            ),
          ]),
          returnStatement(identifier('exports')),
        ]);

        const actual = handleProgram.handler(source, {}, given);
        expect(actual).toEqual(expected);
      });

      it('should handle namespace with multiple type and function declarations - exported and not exported', () => {
        const given = getProgramNode(`
          export namespace Foo {
            export type Bar = { bar: string }
            export function bar() {}
            type Baz = { baz: string }
            function baz() {}
          }
        `);
        const expected = program([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('exports'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('Foo'))],
              [variableDeclaratorValue(tableConstructor())]
            ),
            blockStatement([
              typeAliasDeclaration(
                identifier('Bar'),
                typeReference(identifier('Foo_Bar'))
              ),
              functionDeclaration(identifier('bar')),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [memberExpression(identifier('Foo'), '.', identifier('bar'))],
                [identifier('bar')]
              ),
              typeAliasDeclaration(
                identifier('Baz'),
                typeLiteral([
                  typePropertySignature(
                    identifier('baz'),
                    typeAnnotation(typeString())
                  ),
                ])
              ),
              functionDeclaration(identifier('baz')),
            ]),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [memberExpression(identifier('exports'), '.', identifier('Foo'))],
              [identifier('Foo')]
            ),
            exportTypeStatement(
              typeAliasDeclaration(
                identifier('Foo_Bar'),
                typeLiteral([
                  typePropertySignature(
                    identifier('bar'),
                    typeAnnotation(typeString())
                  ),
                ])
              )
            ),
          ]),
          returnStatement(identifier('exports')),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });
  });
});
