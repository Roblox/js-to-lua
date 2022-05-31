import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  callExpression,
  identifier,
  LuaExpression,
  memberExpression,
  multilineStringLiteral,
  numericLiteral,
  program,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { handleProgram } from './program.handler';
import { getProgramNode } from './program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Template Literal', () => {
    describe('single line', () => {
      it('should handle single line string expression', () => {
        const given = getProgramNode(`
          fizz = \`foo\`;
        `);
        const expected = program([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('fizz')],
            [stringLiteral('foo')]
          ),
        ]);

        const luaProgram = handleProgram.handler(source, {}, given);

        expect(luaProgram).toEqual(expected);
      });

      it('should handle single line string expression with interpolated expression', () => {
        const given = getProgramNode(`
          fizz = \`foo: \${bar}\`;
        `);
        const expected = program([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('fizz')],
            [
              callExpression(
                memberExpression(
                  stringLiteral('foo: %s'),
                  ':',
                  identifier('format')
                ),
                [callExpression(identifier('tostring'), [identifier('bar')])]
              ),
            ]
          ),
        ]);

        const luaProgram = handleProgram.handler(source, {}, given);

        expect(luaProgram).toEqual(expected);
      });

      it('should handle single line string expression with escaped characters', () => {
        const given = getProgramNode(`
          fizz = \`backspace: \\b, combined: \\t\\b\\r, tab: \\t\`;
        `);
        const expected = program([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('fizz')],
            [stringLiteral('backspace: \\b, combined: \\t\\b\\r, tab: \\t')]
          ),
        ]);

        const luaProgram = handleProgram.handler(source, {}, given);

        expect(luaProgram).toEqual(expected);
      });

      it('should handle single line string expression with escaped characters that can be simplified', () => {
        const given = getProgramNode(`
          fizz = \`double quote: \\", single quote: \\', c: \\c, d: \\d\`;
        `);
        const expected = program([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('fizz')],
            [stringLiteral('double quote: ", single quote: \', c: c, d: d')]
          ),
        ]);

        const luaProgram = handleProgram.handler(source, {}, given);

        expect(luaProgram).toEqual(expected);
      });

      it('should handle single line string expression with interpolated expressions and format-like options', () => {
        const given = getProgramNode(`
          fizz = \`abc%s\${value}%sdef\`;
        `);
        const expected = program([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('fizz')],
            [
              callExpression(
                memberExpression(
                  stringLiteral('abc%%s%s%%sdef'),
                  ':',
                  identifier('format')
                ),
                [callExpression(identifier('tostring'), [identifier('value')])]
              ),
            ]
          ),
        ]);

        const luaProgram = handleProgram.handler(source, {}, given);

        expect(luaProgram).toEqual(expected);
      });
    });

    describe('multiline', () => {
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

      it('should handle multiline string expression with escaped characters and interpolated expressions', () => {
        const given = getProgramNode(`
          fizz = \`\nbackspace: \\b\ncombined: \\t\\b\\r\ntab: \\t\nescapeAndInterpolate: \\t\${expression}\ninterpolated: \${expression}\n\`
        `);
        const expected = program([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('fizz')],
            [
              callExpression(
                memberExpression(
                  Array<LuaExpression>(
                    multilineStringLiteral('\n\nbackspace: '),
                    stringLiteral('\\b'),
                    multilineStringLiteral('\n\ncombined: '),
                    stringLiteral('\\t\\b\\r'),
                    multilineStringLiteral('\n\ntab: '),
                    stringLiteral('\\t'),
                    multilineStringLiteral('\n\nescapeAndInterpolate: '),
                    stringLiteral('\\t%s'),
                    multilineStringLiteral('\n\ninterpolated: %s\n')
                  ).reduce((left, right) =>
                    binaryExpression(left, '..', right)
                  ),
                  ':',
                  identifier('format')
                ),
                [
                  callExpression(identifier('tostring'), [
                    identifier('expression'),
                  ]),
                  callExpression(identifier('tostring'), [
                    identifier('expression'),
                  ]),
                ]
              ),
            ]
          ),
        ]);

        const luaProgram = handleProgram.handler(source, {}, given);

        expect(luaProgram).toEqual(expected);
      });

      it('should handle multiline string expression with escaped characters that can be simplified', () => {
        const given = getProgramNode(`
          fizz = \`\nsingle quote: \\'\ndouble quote: \\"\nbacktick: \\\`\nc: \\c\nd: \\d\n\`
        `);
        const expected = program([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('fizz')],
            [
              multilineStringLiteral(
                '\n\nsingle quote: \'\ndouble quote: "\nbacktick: `\nc: c\nd: d\n'
              ),
            ]
          ),
        ]);

        const luaProgram = handleProgram.handler(source, {}, given);

        expect(luaProgram).toEqual(expected);
      });

      it('should handle multiline string expression with interpolated expressions and format-like options', () => {
        const given = getProgramNode(`
          fizz = \`\nabc\n%s\${value}%s\ndef\n\`;
        `);
        const expected = program([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('fizz')],
            [
              callExpression(
                memberExpression(
                  multilineStringLiteral('\n\nabc\n%%s%s%%s\ndef\n'),
                  ':',
                  identifier('format')
                ),
                [callExpression(identifier('tostring'), [identifier('value')])]
              ),
            ]
          ),
        ]);

        const luaProgram = handleProgram.handler(source, {}, given);

        expect(luaProgram).toEqual(expected);
      });
    });
  });
});
