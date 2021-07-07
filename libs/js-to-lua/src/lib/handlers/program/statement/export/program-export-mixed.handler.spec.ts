import {
  assignmentStatement,
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
  withExtras,
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
        withExtras(
          { doesExport: true },
          nodeGroup([
            functionDeclaration(identifier('foo'), [], []),
            assignmentStatement(
              [memberExpression(identifier('exports'), '.', identifier('foo'))],
              [identifier('foo')]
            ),
          ])
        ),
        withExtras(
          { doesExport: true },
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('bar'))],
              [variableDeclaratorValue(numericLiteral(10, '10'))]
            ),
            assignmentStatement(
              [memberExpression(identifier('exports'), '.', identifier('bar'))],
              [identifier('bar')]
            ),
          ])
        ),
        withExtras(
          { doesExport: true },
          assignmentStatement(
            [
              memberExpression(
                identifier('exports'),
                '.',
                identifier('default')
              ),
            ],
            [identifier('foo')]
          )
        ),
        returnStatement(identifier('exports')),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
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
        withExtras(
          { doesExport: true },
          nodeGroup([
            functionDeclaration(identifier('foo'), [], []),
            assignmentStatement(
              [memberExpression(identifier('exports'), '.', identifier('foo'))],
              [identifier('foo')]
            ),
          ])
        ),
        withExtras(
          { doesExport: true },
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('bar'))],
              [variableDeclaratorValue(numericLiteral(10, '10'))]
            ),
            assignmentStatement(
              [memberExpression(identifier('exports'), '.', identifier('bar'))],
              [identifier('bar')]
            ),
          ])
        ),
        withExtras(
          { doesExport: true },
          assignmentStatement(
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
          )
        ),
        returnStatement(identifier('exports')),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
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
        withExtras(
          { doesExport: true },
          nodeGroup([
            functionDeclaration(identifier('foo'), [], []),
            assignmentStatement(
              [memberExpression(identifier('exports'), '.', identifier('foo'))],
              [identifier('foo')]
            ),
          ])
        ),
        withExtras(
          { doesExport: true },
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('bar'))],
              [variableDeclaratorValue(numericLiteral(10, '10'))]
            ),
            assignmentStatement(
              [memberExpression(identifier('exports'), '.', identifier('bar'))],
              [identifier('bar')]
            ),
          ])
        ),
        withExtras(
          { doesExport: true },
          nodeGroup([
            functionDeclaration(identifier('buzz'), [], []),
            assignmentStatement(
              [
                memberExpression(
                  identifier('exports'),
                  '.',
                  identifier('default')
                ),
              ],
              [identifier('buzz')]
            ),
          ])
        ),
        returnStatement(identifier('exports')),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });
  });
});
