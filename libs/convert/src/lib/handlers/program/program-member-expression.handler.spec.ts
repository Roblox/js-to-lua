import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  booleanLiteral,
  callExpression,
  identifier,
  indexExpression,
  memberExpression,
  numericLiteral,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from './program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Member Expressions', () => {
    it(`should convert handle computed index expression: string literal`, () => {
      const given = getProgramNode(`
        fizz = foo['bar']
      `);

      const expected = programWithUpstreamComment([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [indexExpression(identifier('foo'), stringLiteral('bar'))]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should convert handle computed index expression: number literal`, () => {
      const given = getProgramNode(`
        fizz = foo[5]
      `);

      const expected = programWithUpstreamComment([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            indexExpression(
              identifier('foo'),
              withTrailingConversionComment(
                numericLiteral(6),
                'ROBLOX adaptation: added 1 to array index'
              )
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should convert handle computed index expression: octal number literal`, () => {
      const given = getProgramNode(`
        fizz = foo[0o14]
      `);

      const expected = programWithUpstreamComment([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            indexExpression(
              identifier('foo'),
              withTrailingConversionComment(
                numericLiteral(13),
                'ROBLOX adaptation: added 1 to array index'
              )
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should convert handle computed index expression: boolean literal`, () => {
      const given = getProgramNode(`
        fizz = foo[true]
      `);

      const expected = programWithUpstreamComment([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            indexExpression(
              identifier('foo'),
              callExpression(identifier('tostring'), [booleanLiteral(true)])
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should convert handle not computed member expression`, () => {
      const given = getProgramNode(`
        fizz = foo.bar
      `);

      const expected = programWithUpstreamComment([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [memberExpression(identifier('foo'), '.', identifier('bar'))]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should convert handle mixed computed and not computed member expressions`, () => {
      const given = getProgramNode(`
        fizz = foo.bar.baz
        fizz = foo.bar['baz']
        fizz = foo['bar']['baz']
        fizz = foo['bar'].baz
      `);

      const expected = programWithUpstreamComment([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            memberExpression(
              memberExpression(identifier('foo'), '.', identifier('bar')),
              '.',
              identifier('baz')
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            indexExpression(
              memberExpression(identifier('foo'), '.', identifier('bar')),
              stringLiteral('baz')
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            indexExpression(
              indexExpression(identifier('foo'), stringLiteral('bar')),
              stringLiteral('baz')
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            memberExpression(
              indexExpression(identifier('foo'), stringLiteral('bar')),
              '.',
              identifier('baz')
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should convert member expression indexed with member expression`, () => {
      const given = getProgramNode(`
        fizz = foo[bar.baz]
      `);

      const expected = programWithUpstreamComment([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            indexExpression(
              identifier('foo'),
              callExpression(identifier('tostring'), [
                memberExpression(identifier('bar'), '.', identifier('baz')),
              ])
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it(`should convert member expression indexed with index expression`, () => {
      const given = getProgramNode(`
        fizz = foo[bar[baz]]
      `);

      const expected = programWithUpstreamComment([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            indexExpression(
              identifier('foo'),
              callExpression(identifier('tostring'), [
                indexExpression(
                  identifier('bar'),
                  callExpression(identifier('tostring'), [identifier('baz')])
                ),
              ])
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });
});
