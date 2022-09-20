import { selfIdentifier } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  commentLine,
  exportTypeStatement,
  functionDeclaration,
  functionExpression,
  functionReturnType,
  identifier,
  memberExpression,
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
  typePropertySignature,
  typeReference,
  typeString,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Export Default Handler', () => {
    it(`should export default identifier`, () => {
      const given = getProgramNode(`
        export default foo
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [memberExpression(identifier('exports'), '.', identifier('default'))],
          [identifier('foo')]
        ),
        returnStatement(identifier('exports')),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should export default ObjectExpression`, () => {
      const given = getProgramNode(`
        export default {
          foo: 'bar'
        }
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [memberExpression(identifier('exports'), '.', identifier('default'))],
          [
            tableConstructor([
              tableNameKeyField(identifier('foo'), stringLiteral('bar')),
            ]),
          ]
        ),
        returnStatement(identifier('exports')),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should export default function declaration`, () => {
      const given = getProgramNode(`
        export default function foo() {}
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        nodeGroup([
          functionDeclaration(identifier('foo'), [], nodeGroup([])),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [
              memberExpression(
                identifier('exports'),
                '.',
                identifier('default')
              ),
            ],
            [identifier('foo')]
          ),
        ]),
        returnStatement(identifier('exports')),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should export default function unnamed declaration`, () => {
      const given = getProgramNode(`
        export default function () {}
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [memberExpression(identifier('exports'), '.', identifier('default'))],
          [functionExpression([], nodeGroup([]))]
        ),
        returnStatement(identifier('exports')),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should export default class declaration`, () => {
      const given = getProgramNode(`
        export default class Foo {
          prop: string
        }
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        nodeGroup([
          exportTypeStatement(
            typeAliasDeclaration(
              identifier('Foo'),
              typeLiteral([
                typePropertySignature(
                  identifier('prop'),
                  typeAnnotation(typeString())
                ),
              ])
            )
          ),
          nodeGroup([
            typeAliasDeclaration(
              identifier('Foo_statics'),
              typeLiteral([
                typePropertySignature(
                  identifier('new'),
                  typeAnnotation(
                    typeFunction(
                      [],
                      functionReturnType([typeReference(identifier('Foo'))])
                    )
                  )
                ),
              ])
            ),
          ]),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Foo'))],
            [
              variableDeclaratorValue(
                typeCastExpression(
                  tableConstructor(),
                  typeIntersection([
                    typeReference(identifier('Foo')),
                    typeReference(identifier('Foo_statics')),
                  ])
                )
              ),
            ]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [
              memberExpression(
                typeCastExpression(identifier('Foo'), typeAny()),
                '.',
                identifier('__index')
              ),
            ],
            [identifier('Foo')]
          ),
          functionDeclaration(
            identifier('Foo.new'),
            [],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(identifier('self'))],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('setmetatable'), [
                      tableConstructor(),
                      identifier('Foo'),
                    ])
                  ),
                ]
              ),
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(identifier('Foo'))
                )
              ),
            ]),
            typeReference(identifier('Foo')),
            false
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [
              memberExpression(
                identifier('exports'),
                '.',
                identifier('default')
              ),
            ],
            [identifier('Foo')]
          ),
        ]),
        returnStatement(identifier('exports')),
      ]);

      const actual = convertProgram(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it(`should export default arrow expression`, () => {
      const given = getProgramNode(`
        export default () => {}
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [memberExpression(identifier('exports'), '.', identifier('default'))],
          [functionExpression([], nodeGroup([]))]
        ),
        returnStatement(identifier('exports')),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should export default expression`, () => {
      const given = getProgramNode(`
        export default foo()
      `);
      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [memberExpression(identifier('exports'), '.', identifier('default'))],
          [callExpression(identifier('foo'), [])]
        ),
        returnStatement(identifier('exports')),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    describe('with comments', () => {
      it(`should export default identifier with leading comment`, () => {
        const given = getProgramNode(`
          // leading comment
          export default foo
        `);
        const expected = programWithUpstreamComment([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('exports'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          {
            ...assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [
                memberExpression(
                  identifier('exports'),
                  '.',
                  identifier('default')
                ),
              ],
              [identifier('foo')]
            ),
            leadingComments: [commentLine(' leading comment')],
          },
          returnStatement(identifier('exports')),
        ]);

        expect(convertProgram(source, {}, given)).toEqual(expected);
      });

      it(`should export default identifier with trailing comment`, () => {
        const given = getProgramNode(`
          export default foo
          // trailing comment
        `);
        const expected = programWithUpstreamComment([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('exports'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          {
            ...assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [
                memberExpression(
                  identifier('exports'),
                  '.',
                  identifier('default')
                ),
              ],
              [identifier('foo')]
            ),
            trailingComments: [commentLine(' trailing comment')],
          },
          returnStatement(identifier('exports')),
        ]);

        expect(convertProgram(source, {}, given)).toEqual(expected);
      });

      it(`should export default identifier with leading and trailing comment`, () => {
        const given = getProgramNode(`
          // leading comment
          export default foo
          // trailing comment
        `);
        const expected = programWithUpstreamComment([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('exports'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          {
            ...assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [
                memberExpression(
                  identifier('exports'),
                  '.',
                  identifier('default')
                ),
              ],
              [identifier('foo')]
            ),
            leadingComments: [commentLine(' leading comment')],
            trailingComments: [commentLine(' trailing comment')],
          },
          returnStatement(identifier('exports')),
        ]);

        expect(convertProgram(source, {}, given)).toEqual(expected);
      });
    });
  });
});
