import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  identifier,
  memberExpression,
  multilineStringLiteral,
  numericLiteral,
  program,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';
import { handleProgram } from './program.handler';

const source = '';

describe('Program handler', () => {
  describe('Template Literal', () => {
    it('should handle multiline string expression without leading new line', () => {
      const given = getProgramNode(`
        fizz = \`foo\nbar\nbaz\n\`;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [multilineStringLiteral('foo\nbar\nbaz\n')]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle multiline string expression with leading new line', () => {
      const given = getProgramNode(`
        fizz = \`\nfoo\nbar\nbaz\n\`;
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [multilineStringLiteral('\n\nfoo\nbar\nbaz\n')]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle multiline string expression with interpolated expression', () => {
      const given = getProgramNode(`
        fizz = \`foo: \${foo}\nbar: \${"bar"}\nbaz: \${1}\n\`
      `);
      const expected = program([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('fizz')],
          [
            callExpression(
              memberExpression(
                multilineStringLiteral('foo: %s\nbar: %s\nbaz: %s\n'),
                ':',
                identifier('format')
              ),
              [
                callExpression(identifier('tostring'), [identifier('foo')]),
                stringLiteral('bar'),
                callExpression(identifier('tostring'), [
                  numericLiteral(1, '1'),
                ]),
              ]
            ),
          ]
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
