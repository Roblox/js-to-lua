import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  identifier,
  numericLiteral,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from './program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Numeric', () => {
    it('should handle numeric expressions', () => {
      const given = getProgramNode(`
      foo = 1;
      foo = 2;
      foo = 34;
    `);
      const expected = programWithUpstreamComment([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [numericLiteral(1, '1')]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [numericLiteral(2, '2')]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [numericLiteral(34, '34')]
        ),
      ]);

      const luaProgram = convertProgram(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
