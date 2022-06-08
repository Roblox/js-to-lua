import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  expressionStatement,
  identifier,
  memberExpression,
  nodeGroup,
  program,
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
        nodeGroup([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('foo')],
            [identifier('bar')]
          ),
          expressionStatement(
            callExpression(identifier('func'), [identifier('foo')])
          ),
        ]),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should wrap assignment statement with an IIFE - assign to member expression`, () => {
      const given = getProgramNode(`
        func(foo.bar = bar)
      `);
      const expected = program([
        nodeGroup([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [memberExpression(identifier('foo'), '.', identifier('bar'))],
            [identifier('bar')]
          ),
          expressionStatement(
            callExpression(identifier('func'), [
              memberExpression(identifier('foo'), '.', identifier('bar')),
            ])
          ),
        ]),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle wrap chained AssignmentStatement with an IIFE`, () => {
      const given = getProgramNode(`
        func(foo = bar = baz)
      `);
      const expected = program([
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
          expressionStatement(
            callExpression(identifier('func'), [identifier('foo')])
          ),
        ]),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle wrap chained AssignmentStatement WITHOUT an IIFE - assign to member expression`, () => {
      const given = getProgramNode(`
        func(foo.bar = bar.baz = baz)
      `);
      const expected = program([
        nodeGroup([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [memberExpression(identifier('bar'), '.', identifier('baz'))],
            [identifier('baz')]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [memberExpression(identifier('foo'), '.', identifier('bar'))],
            [memberExpression(identifier('bar'), '.', identifier('baz'))]
          ),
          expressionStatement(
            callExpression(identifier('func'), [
              memberExpression(identifier('foo'), '.', identifier('bar')),
            ])
          ),
        ]),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
