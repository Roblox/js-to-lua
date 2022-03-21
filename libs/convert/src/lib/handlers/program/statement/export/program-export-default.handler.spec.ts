import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  commentLine,
  exportTypeStatement,
  functionDeclaration,
  functionExpression,
  identifier,
  memberExpression,
  nodeGroup,
  program,
  returnStatement,
  stringLiteral,
  tableConstructor,
  tableNameKeyField,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeLiteral,
  typePropertySignature,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../../program.handler';
import { getProgramNode } from '../../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Export Default Handler', () => {
    it(`should export default identifier`, () => {
      const given = getProgramNode(`
        export default foo
      `);
      const expected = program([
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

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should export default ObjectExpression`, () => {
      const given = getProgramNode(`
        export default {
          foo: 'bar'
        }
      `);
      const expected = program([
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

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should export default function declaration`, () => {
      const given = getProgramNode(`
        export default function foo() {}
      `);
      const expected = program([
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

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should export default function unnamed declaration`, () => {
      const given = getProgramNode(`
        export default function () {}
      `);
      const expected = program([
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

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should export default class declaration`, () => {
      const given = getProgramNode(`
        export default class Foo {
          prop: string
        }
      `);
      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        nodeGroup([
          exportTypeStatement(
            withTrailingConversionComment(
              typeAliasDeclaration(
                identifier('Foo'),
                typeLiteral([
                  typePropertySignature(
                    identifier('prop'),
                    typeAnnotation(typeAny())
                  ),
                ])
              ),
              "ROBLOX TODO: replace 'any' type/ add missing"
            )
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('Foo'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [memberExpression(identifier('Foo'), '.', identifier('__index'))],
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
              returnStatement(identifier('self')),
            ]),
            undefined,
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

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    describe('with comments', () => {
      it(`should export default identifier with leading comment`, () => {
        const given = getProgramNode(`
          // leading comment
          export default foo
        `);
        const expected = program([
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

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it(`should export default identifier with trailing comment`, () => {
        const given = getProgramNode(`
          export default foo
          // trailing comment
        `);
        const expected = program([
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

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it(`should export default identifier with leading and trailing comment`, () => {
        const given = getProgramNode(`
          // leading comment
          export default foo
          // trailing comment
        `);
        const expected = program([
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

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });
  });
});
