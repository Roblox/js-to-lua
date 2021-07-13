import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
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
                  assignmentStatement(
                    AssignmentStatementOperatorEnum.EQ,
                    [identifier('foo')],
                    [identifier('bar')]
                  ),
                  returnStatement(identifier('foo')),
                ]
              ),
              []
            ),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
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
                      AssignmentStatementOperatorEnum.EQ,
                      [identifier('bar')],
                      [identifier('baz')]
                    ),
                    assignmentStatement(
                      AssignmentStatementOperatorEnum.EQ,
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

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
