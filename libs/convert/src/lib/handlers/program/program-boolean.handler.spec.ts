import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  booleanLiteral,
  identifier,
} from '@js-to-lua/lua-types';
import { handleProgram } from './program.handler';
import {
  getProgramNode,
  programWithUpstreamComment,
} from './program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Boolean', () => {
    it('should handle boolean expressions', () => {
      const given = getProgramNode(`
        foo = true
        foo = false
      `);
      const expected = programWithUpstreamComment([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [booleanLiteral(true)]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [booleanLiteral(false)]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
