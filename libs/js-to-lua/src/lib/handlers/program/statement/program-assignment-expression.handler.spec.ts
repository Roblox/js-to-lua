import {
  assignmentStatement,
  callExpression,
  expressionStatement,
  functionExpression,
  identifier,
  nodeGroup,
  program,
  returnStatement,
} from '@js-to-lua/lua-types';
import { getProgramNode } from '../program.spec.utils';
import { handleProgram } from '../program.handler';

const source = '';

describe('Program handler', () => {
  describe('Assignment Expression Handler', () => {
    it(`should wrap assignment statement with an IIFE `, () => {
      const given = getProgramNode(`
        func(foo = bar)
      `);
      const expected = program([
        expressionStatement(
          callExpression(identifier('func'), [
            callExpression(
              functionExpression(
                [],
                [
                  assignmentStatement([identifier('foo')], [identifier('bar')]),
                  returnStatement(identifier('foo')),
                ]
              ),
              []
            ),
          ])
        ),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it(`should handle wrap chained AssignmentStatement with an IIFE`, () => {
      const given = getProgramNode(`
        func(foo = bar = baz)
      `);
      const expected = program([
        expressionStatement(
          callExpression(identifier('func'), [
            callExpression(
              functionExpression(
                [],
                [
                  nodeGroup([
                    assignmentStatement(
                      [identifier('bar')],
                      [identifier('baz')]
                    ),
                    assignmentStatement(
                      [identifier('foo')],
                      [identifier('bar')]
                    ),
                  ]),
                  returnStatement(identifier('foo')),
                ]
              ),
              []
            ),
          ])
        ),
      ]);

      const actual1 = handleProgram.handler(source, {}, given);
      expect(actual1).toEqual(expected);
    });
  });
});
