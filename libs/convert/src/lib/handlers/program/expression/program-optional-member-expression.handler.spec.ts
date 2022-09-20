import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  callExpression,
  elseExpressionClause,
  identifier,
  ifElseExpression,
  ifExpressionClause,
  indexExpression,
  memberExpression,
  nilLiteral,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

describe('Program handler', () => {
  describe('OptionalMemberExpression handler', () => {
    it('should handle basic optional member expression', () => {
      const source = `
        test = foo?.bar
      `;

      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('test')],
          [
            ifElseExpression(
              ifExpressionClause(
                binaryExpression(
                  callExpression(identifier('typeof'), [identifier('foo')]),
                  '==',
                  stringLiteral('table')
                ),
                memberExpression(identifier('foo'), '.', identifier('bar'))
              ),
              elseExpressionClause(nilLiteral())
            ),
          ]
        ),
      ]);
      const luaProgram = convertProgram(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
    it('should handle computed optional member expression', () => {
      const source = `
        test = foo?.[bar]
      `;

      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('test')],
          [
            ifElseExpression(
              ifExpressionClause(
                binaryExpression(
                  callExpression(identifier('typeof'), [identifier('foo')]),
                  '==',
                  stringLiteral('table')
                ),
                indexExpression(identifier('foo'), identifier('bar'))
              ),
              elseExpressionClause(nilLiteral())
            ),
          ]
        ),
      ]);
      const luaProgram = convertProgram(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
