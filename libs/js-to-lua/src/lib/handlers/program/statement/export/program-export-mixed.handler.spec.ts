import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  functionDeclaration,
  identifier,
  memberExpression,
  nodeGroup,
  numericLiteral,
  program,
  returnStatement,
  stringLiteral,
  tableConstructor,
  tableNameKeyField,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { getProgramNode } from '../../program.spec.utils';
import { handleProgram } from '../../program.handler';

const source = '';

describe('Program handler', () => {
  describe('Export Default Handler', () => {
    it(`should export mixed named and default`, () => {
      const given = getProgramNode(`
        export function foo() {}
        export const bar = 10
        export default foo
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
      const expected = program([
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
      const expected = program([
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
  });
});
