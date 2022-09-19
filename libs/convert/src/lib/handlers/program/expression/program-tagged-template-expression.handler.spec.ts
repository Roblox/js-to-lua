import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  expressionStatement,
  identifier,
  multilineStringLiteral,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import { dedent } from '@js-to-lua/shared-utils';
import { handleProgram } from '../program.handler';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

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

      const expected = programWithUpstreamComment([
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

      const expected = programWithUpstreamComment([
        withTrailingConversionComment(
          unhandledStatement(),
          `ROBLOX TODO: Unhandled node for type: TaggedTemplateExpression`,
          dedent`
              gql\`
                foo
                \${bar}
                baz
              \``
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
