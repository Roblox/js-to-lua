import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  functionDeclaration,
  identifier,
  nodeGroup,
  returnStatement,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

const source = '';
describe('Program handler', () => {
  describe('Return Statement Handler', () => {
    it(`should handle empty ReturnStatement `, () => {
      const given = getProgramNode(`
        function func() {
          return
        }
      `);
      const expected = programWithUpstreamComment([
        functionDeclaration(
          identifier('func'),
          [],
          nodeGroup([returnStatement()])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should handle simple ReturnStatement `, () => {
      const given = getProgramNode(`
        function func() {
          return foo
        }
      `);
      const expected = programWithUpstreamComment([
        functionDeclaration(
          identifier('func'),
          [],
          nodeGroup([returnStatement(identifier('foo'))])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should handle ReturnStatement that yields another statement`, () => {
      const given = getProgramNode(`
        function func() {
          return foo = bar
        }
      `);
      const expected = programWithUpstreamComment([
        functionDeclaration(
          identifier('func'),
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
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });
});
