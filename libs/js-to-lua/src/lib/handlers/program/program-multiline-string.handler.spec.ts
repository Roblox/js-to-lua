import {
  callExpression,
  expressionStatement,
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
  describe('Multiline String', () => {
    it('should handle multiline string expression without leading new line', () => {
      const given = getProgramNode(`
      \`foo\nbar\nbaz\n\`;
    `);
      const expected = program([
        expressionStatement(multilineStringLiteral('foo\nbar\nbaz\n')),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle multiline string expression with leading new line', () => {
      const given = getProgramNode(`
      \`\nfoo\nbar\nbaz\n\`;
    `);
      const expected = program([
        expressionStatement(multilineStringLiteral('\n\nfoo\nbar\nbaz\n')),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });

    it('should handle multiline string expression with interpolated expression', () => {
      const given = getProgramNode(`
      \`foo: \${foo}\nbar: \${"bar"}\nbaz: \${1}\n\`
    `);
      const expected = program([
        expressionStatement(
          callExpression(
            memberExpression(
              multilineStringLiteral('foo: %s\nbar: %s\nbaz: %s\n'),
              ':',
              identifier('format')
            ),
            [identifier('foo'), stringLiteral('bar'), numericLiteral(1, '1')]
          )
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });
});
