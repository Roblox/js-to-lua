import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  expressionStatement,
  functionExpression,
  identifier,
  memberExpression,
  nodeGroup,
  program,
  returnStatement,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Assignment Expression Handler', () => {
    it(`should wrap assignment statement with an IIFE`, () => {
      const given = getProgramNode(`
        func(foo = bar)
      `);
      const expected = program([
        expressionStatement(
          callExpression(identifier('func'), [
            callExpression(
              functionExpression(
                [],
                nodeGroup([
                  assignmentStatement(
                    AssignmentStatementOperatorEnum.EQ,
                    [identifier('foo')],
                    [identifier('bar')]
                  ),
                  returnStatement(identifier('foo')),
                ])
              ),
              []
            ),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should wrap assignment statement with an IIFE - assign to member expression`, () => {
      const given = getProgramNode(`
        func(foo.bar = bar)
      `);
      const expected = program([
        expressionStatement(
          callExpression(identifier('func'), [
            callExpression(
              functionExpression(
                [],
                nodeGroup([
                  assignmentStatement(
                    AssignmentStatementOperatorEnum.EQ,
                    [
                      memberExpression(
                        identifier('foo'),
                        '.',
                        identifier('bar')
                      ),
                    ],
                    [identifier('bar')]
                  ),
                  returnStatement(
                    memberExpression(identifier('foo'), '.', identifier('bar'))
                  ),
                ])
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
                  returnStatement(identifier('foo')),
                ])
              ),
              []
            ),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle wrap chained AssignmentStatement with an IIFE - assign to member expression`, () => {
      const given = getProgramNode(`
        func(foo.bar = bar.baz = baz)
      `);
      const expected = program([
        expressionStatement(
          callExpression(identifier('func'), [
            callExpression(
              functionExpression(
                [],
                nodeGroup([
                  assignmentStatement(
                    AssignmentStatementOperatorEnum.EQ,
                    [
                      memberExpression(
                        identifier('bar'),
                        '.',
                        identifier('baz')
                      ),
                    ],
                    [identifier('baz')]
                  ),
                  assignmentStatement(
                    AssignmentStatementOperatorEnum.EQ,
                    [
                      memberExpression(
                        identifier('foo'),
                        '.',
                        identifier('bar')
                      ),
                    ],
                    [
                      memberExpression(
                        identifier('bar'),
                        '.',
                        identifier('baz')
                      ),
                    ]
                  ),
                  returnStatement(
                    memberExpression(identifier('foo'), '.', identifier('bar'))
                  ),
                ])
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
