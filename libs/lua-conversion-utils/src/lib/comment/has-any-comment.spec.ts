import {
  blockStatement,
  commentBlock,
  LuaBlockStatement,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { applyTo, pipe } from 'ramda';
import { hasAnyComment } from './has-any-comment';
import { withInnerComments } from './inner-comment';
import { withLeadingComments } from './leading-comment';
import { withTrailingComments } from './trailing-comment';

describe('Has any comment', () => {
  it('should return false if node has no comments fields', () => {
    expect(hasAnyComment(stringLiteral('hello'))).toBe(false);
  });

  it('should return false if node has zero comments', () => {
    expect(
      hasAnyComment({
        ...stringLiteral('hello'),
        leadingComments: [],
        trailingComments: [],
        innerComments: [],
      })
    ).toBe(false);
  });

  it('should return true if has one leading comment', () => {
    expect(
      hasAnyComment(
        withLeadingComments(
          stringLiteral('hello'),
          commentBlock('leading comment')
        )
      )
    ).toBe(true);
  });

  it('should return true if has one trailing comment', () => {
    expect(
      hasAnyComment(
        withTrailingComments(
          stringLiteral('hello'),
          commentBlock('trailing comment')
        )
      )
    ).toBe(true);
  });

  it('should return true if has one inner comment', () => {
    expect(
      hasAnyComment(
        withInnerComments(blockStatement([]), commentBlock('inner comment'))
      )
    ).toBe(true);
  });

  it('should return true if has multiple leading comment', () => {
    expect(
      hasAnyComment(
        withLeadingComments(
          stringLiteral('hello'),
          commentBlock('leading comment 1'),
          commentBlock('leading comment 2')
        )
      )
    ).toBe(true);
  });

  it('should return true if has multiple trailing comment', () => {
    expect(
      hasAnyComment(
        withTrailingComments(
          stringLiteral('hello'),
          commentBlock('trailing comment 1'),
          commentBlock('trailing comment 2')
        )
      )
    ).toBe(true);
  });

  it('should return true if has multiple inner comment', () => {
    expect(
      hasAnyComment(
        withInnerComments(
          blockStatement([]),
          commentBlock('inner comment 1'),
          commentBlock('inner comment 2')
        )
      )
    ).toBe(true);
  });

  it('should return true if has multiple different comment', () => {
    expect(
      hasAnyComment(
        applyTo(
          blockStatement([]),
          pipe(
            (node: LuaBlockStatement) =>
              withLeadingComments(
                node,
                commentBlock('leading comment 1'),
                commentBlock('leading comment 2')
              ),
            (node) =>
              withTrailingComments(
                node,
                commentBlock('trailing comment 1'),
                commentBlock('trailing comment 2')
              ),
            (node) =>
              withInnerComments(
                node,
                commentBlock('inner comment 1'),
                commentBlock('inner comment 2')
              )
          )
        )
      )
    ).toBe(true);
  });
});
