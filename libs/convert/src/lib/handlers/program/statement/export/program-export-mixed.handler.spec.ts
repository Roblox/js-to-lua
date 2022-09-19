import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  commentLine,
  functionDeclaration,
  identifier,
  memberExpression,
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
import { handleProgram } from '../../program.handler';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Export Default Handler', () => {
    it(`should export mixed named and default`, () => {
      const given = getProgramNode(`
        export function foo() {}
        export const bar = 10
        export default foo
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
            [memberExpression(identifier('exports'), '.', identifier('foo'))],
            [identifier('foo')]
          ),
        ]),
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('bar'))],
            [variableDeclaratorValue(numericLiteral(10, '10'))]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [memberExpression(identifier('exports'), '.', identifier('bar'))],
            [identifier('bar')]
          ),
        ]),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [memberExpression(identifier('exports'), '.', identifier('default'))],
          [identifier('foo')]
        ),
        returnStatement(identifier('exports')),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should export mixed named and default ObjectExpression`, () => {
      const given = getProgramNode(`
        export function foo() {}
        export const bar = 10
        export default {
          foo: 'bar'
        }
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
            [memberExpression(identifier('exports'), '.', identifier('foo'))],
            [identifier('foo')]
          ),
        ]),
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('bar'))],
            [variableDeclaratorValue(numericLiteral(10, '10'))]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [memberExpression(identifier('exports'), '.', identifier('bar'))],
            [identifier('bar')]
          ),
        ]),
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

    it(`should export mixed named and default function declaration`, () => {
      const given = getProgramNode(`
        export function foo() {}
        export const bar = 10
        export default function buzz() {}
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
            [memberExpression(identifier('exports'), '.', identifier('foo'))],
            [identifier('foo')]
          ),
        ]),
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('bar'))],
            [variableDeclaratorValue(numericLiteral(10, '10'))]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [memberExpression(identifier('exports'), '.', identifier('bar'))],
            [identifier('bar')]
          ),
        ]),
        nodeGroup([
          functionDeclaration(identifier('buzz'), [], nodeGroup([])),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [
              memberExpression(
                identifier('exports'),
                '.',
                identifier('default')
              ),
            ],
            [identifier('buzz')]
          ),
        ]),
        returnStatement(identifier('exports')),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    describe('with comments', () => {
      it(`should export mixed named and default`, () => {
        const given = getProgramNode(`
          // comment 1
          export function foo() {}
          // comment 2
          export const bar = 10
          // comment 3
          export default foo
          // comment 4
        `);
        const expected = programWithUpstreamComment([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('exports'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          {
            ...nodeGroup([
              functionDeclaration(identifier('foo'), [], nodeGroup([])),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    identifier('exports'),
                    '.',
                    identifier('foo')
                  ),
                ],
                [identifier('foo')]
              ),
            ]),
            leadingComments: [commentLine(' comment 1')],
            trailingComments: [commentLine(' comment 2')],
          },
          {
            ...nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(identifier('bar'))],
                [variableDeclaratorValue(numericLiteral(10, '10'))]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    identifier('exports'),
                    '.',
                    identifier('bar')
                  ),
                ],
                [identifier('bar')]
              ),
            ]),
            leadingComments: [commentLine(' comment 2')],
            trailingComments: [commentLine(' comment 3')],
          },
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
            leadingComments: [commentLine(' comment 3')],
            trailingComments: [commentLine(' comment 4')],
          },
          returnStatement(identifier('exports')),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it(`should export mixed named and default ObjectExpression`, () => {
        const given = getProgramNode(`
          // comment 1
          export function foo() {}
          // comment 2
          export const bar = 10
          // comment 3
          export default {
            foo: 'bar'
          }
          // comment 4
        `);
        const expected = programWithUpstreamComment([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('exports'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          {
            ...nodeGroup([
              functionDeclaration(identifier('foo'), [], nodeGroup([])),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    identifier('exports'),
                    '.',
                    identifier('foo')
                  ),
                ],
                [identifier('foo')]
              ),
            ]),
            leadingComments: [commentLine(' comment 1')],
            trailingComments: [commentLine(' comment 2')],
          },
          {
            ...nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(identifier('bar'))],
                [variableDeclaratorValue(numericLiteral(10, '10'))]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    identifier('exports'),
                    '.',
                    identifier('bar')
                  ),
                ],
                [identifier('bar')]
              ),
            ]),
            leadingComments: [commentLine(' comment 2')],
            trailingComments: [commentLine(' comment 3')],
          },
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
              [
                tableConstructor([
                  tableNameKeyField(identifier('foo'), stringLiteral('bar')),
                ]),
              ]
            ),
            leadingComments: [commentLine(' comment 3')],
            trailingComments: [commentLine(' comment 4')],
          },
          returnStatement(identifier('exports')),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it(`should export mixed named and default function declaration`, () => {
        const given = getProgramNode(`
          // comment 1
          export function foo() {}
          // comment 2
          export const bar = 10
          // comment 3
          export default function buzz() {}
          // comment 4
        `);
        const expected = programWithUpstreamComment([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('exports'))],
            [variableDeclaratorValue(tableConstructor())]
          ),
          {
            ...nodeGroup([
              functionDeclaration(identifier('foo'), [], nodeGroup([])),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    identifier('exports'),
                    '.',
                    identifier('foo')
                  ),
                ],
                [identifier('foo')]
              ),
            ]),
            leadingComments: [commentLine(' comment 1')],
            trailingComments: [commentLine(' comment 2')],
          },
          {
            ...nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(identifier('bar'))],
                [variableDeclaratorValue(numericLiteral(10, '10'))]
              ),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    identifier('exports'),
                    '.',
                    identifier('bar')
                  ),
                ],
                [identifier('bar')]
              ),
            ]),
            leadingComments: [commentLine(' comment 2')],
            trailingComments: [commentLine(' comment 3')],
          },
          {
            ...nodeGroup([
              functionDeclaration(identifier('buzz'), [], nodeGroup([])),
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [
                  memberExpression(
                    identifier('exports'),
                    '.',
                    identifier('default')
                  ),
                ],
                [identifier('buzz')]
              ),
            ]),
            leadingComments: [commentLine(' comment 3')],
            trailingComments: [commentLine(' comment 4')],
          },
          returnStatement(identifier('exports')),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });
  });
});
