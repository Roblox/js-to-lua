import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
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
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { getProgramNode } from '../../program.spec.utils';
import { handleProgram } from '../../program.handler';

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
  });
});
