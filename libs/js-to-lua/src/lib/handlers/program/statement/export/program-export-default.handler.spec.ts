import {
  assignmentStatement,
  functionDeclaration,
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
  withExtras,
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

      const actual = handleProgram.handler(source, given);
      expect(actual).toEqual(expected);
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

      const actual = handleProgram.handler(source, given);
      expect(actual).toEqual(expected);
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
        withExtras(
          { doesExport: true },
          nodeGroup([
            functionDeclaration(identifier('foo'), [], []),
            assignmentStatement(
              [
                memberExpression(
                  identifier('exports'),
                  '.',
                  identifier('default')
                ),
              ],
              [identifier('foo')]
            ),
          ])
        ),
        returnStatement(identifier('exports')),
      ]);

      const actual = handleProgram.handler(source, given);
      expect(actual).toEqual(expected);
    });
  });
});
