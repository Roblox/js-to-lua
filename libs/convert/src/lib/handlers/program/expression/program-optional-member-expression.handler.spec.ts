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
  program,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

describe('Program handler', () => {
  describe('OptionalMemberExpression handler', () => {
    it('should handle basic optional member expression', () => {
      const source = `
        test = foo?.bar
      `;

      const given = getProgramNode(source);

      const expected = program([
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
      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
    it('should handle computed optional member expression', () => {
      const source = `
        test = foo?.[bar]
      `;

      const given = getProgramNode(source);

      const expected = program([
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
      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
