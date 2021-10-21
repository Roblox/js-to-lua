import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../../testUtils/mock-node';
import {
  identifier as babelIdentifier,
  stringLiteral,
  TaggedTemplateExpression,
  taggedTemplateExpression,
  templateElement,
  templateLiteral,
} from '@babel/types';
import {
  callExpression,
  unhandledExpression,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { createTaggedTemplateExpressionHandler } from './tagged-template-expression.handler';

describe('Tagged Template Expression Handler', () => {
  const source = '';

  const handleTaggedTemplateExpression = createTaggedTemplateExpressionHandler(
    mockNodeWithValueHandler,
    mockNodeWithValueHandler
  ).handler;

  it('should handle TaggedTemplateExpression with no template expressions', () => {
    const given = taggedTemplateExpression(
      babelIdentifier('foo'),
      templateLiteral([templateElement({ raw: '\nfoo\nbar\nbaz\n' })], [])
    );

    const expected = callExpression(mockNodeWithValue(babelIdentifier('foo')), [
      mockNodeWithValue(
        templateLiteral([templateElement({ raw: '\nfoo\nbar\nbaz\n' })], [])
      ),
    ]);

    expect(handleTaggedTemplateExpression(source, {}, given)).toEqual(expected);
  });

  it('should not handle TaggedTemplateExpression with template expressions', () => {
    const source =
      '<this is some previous source><this is tagged template source>';

    const given: TaggedTemplateExpression = {
      ...taggedTemplateExpression(
        babelIdentifier('foo'),
        templateLiteral(
          [
            templateElement({ raw: '\nfoo\nbar\nbaz\n' }),
            templateElement({ raw: '\nfoo\nbar\nbaz\n' }),
          ],
          [stringLiteral('kaboom')]
        )
      ),
      start: '<this is some previous source>'.length,
      end: source.length,
    };

    const expected = withTrailingConversionComment(
      unhandledExpression(),
      `ROBLOX TODO: Unhandled node for type: TaggedTemplateExpression`,
      '<this is tagged template source>'
    );

    expect(handleTaggedTemplateExpression(source, {}, given)).toEqual(expected);
  });
});
