import {
  assignmentStatement,
  functionDeclaration,
  identifier,
  memberExpression,
  nodeGroup,
  numericLiteral,
  program,
  returnStatement,
  tableConstructor,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withExtras,
} from '@js-to-lua/lua-types';
import { getProgramNode } from '../../program.spec.utils';
import { handleProgram } from '../../program.handler';

const source = '';

describe('Program handler', () => {
  describe('Export Named Handler', () => {
    it(`should export named variable declaration`, () => {
      const given = getProgramNode(`
        export const foo = 10
      `);
      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('exports'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        withExtras(
          { doesExport: true },
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('foo'))],
              [variableDeclaratorValue(numericLiteral(10, '10'))]
            ),
            assignmentStatement(
              [memberExpression(identifier('exports'), '.', identifier('foo'))],
              [identifier('foo')]
            ),
          ])
        ),
        returnStatement(identifier('exports')),
      ]);

      const actual = handleProgram.handler(source, given);
      expect(actual).toEqual(expected);
    });

    it(`should export named function declaration`, () => {
      const given = getProgramNode(`
        export function foo() {}
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
        returnStatement(identifier('exports')),
      ]);

      const actual = handleProgram.handler(source, given);
      expect(actual).toEqual(expected);
    });

    it(`should export multiple named declarations`, () => {
      const given = getProgramNode(`
        export function foo() {}
        export const bar = 10
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
        returnStatement(identifier('exports')),
      ]);

      const actual = handleProgram.handler(source, given);
      expect(actual).toEqual(expected);
    });
  });
});
