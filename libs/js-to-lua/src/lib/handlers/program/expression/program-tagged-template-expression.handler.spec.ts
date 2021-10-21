import { getProgramNode } from '../program.spec.utils';
import {
  callExpression,
  expressionStatement,
  identifier,
  multilineStringLiteral,
  program,
  unhandledExpression,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import dedent from '../../../testUtils/dedent';

describe('Program handler', () => {
  describe('Tagged Template Expression Handler', () => {
    it('should handle TaggedTemplateExpression with no template expressions', () => {
      const source = dedent`
      gql\`
        foo
        bar
        baz
      \`
      `;

      const given = getProgramNode(source);

      const expected = program([
        expressionStatement(
          callExpression(identifier('gql'), [
            multilineStringLiteral('\n\n  foo\n  bar\n  baz\n'),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should not handle YET TaggedTemplateExpression with template expressions', () => {
      const source = dedent`
        gql\`
          foo
          \${bar}
          baz
        \`
      `;

      const given = getProgramNode(source);

      const expected = program([
        expressionStatement(
          withTrailingConversionComment(
            unhandledExpression(),
            `ROBLOX TODO: Unhandled node for type: TaggedTemplateExpression`,
            dedent`
              gql\`
                foo
                \${bar}
                baz
              \``
          )
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
