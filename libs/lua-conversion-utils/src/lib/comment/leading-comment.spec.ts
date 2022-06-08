import { commentBlock } from '@js-to-lua/lua-types';
import { mockNode } from '@js-to-lua/lua-types/test-utils';
import {
  withAnyLeadingConversionComments,
  withSameLineLeadingConversionComments,
} from './leading-comment';

describe('Leading SameLineLeadingComment conversion comment', () => {
  describe('first comment', () => {
    it('should add one leading comment', () => {
      const given = mockNode();
      const result = withSameLineLeadingConversionComments(
        given,
        ' Leading comment '
      );
      const expected = {
        ...mockNode(),
        leadingComments: [
          commentBlock(' Leading comment ', 'SameLineLeadingComment'),
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should add one Any leading comment', () => {
      const given = mockNode();
      const result = withAnyLeadingConversionComments(
        given,
        ' Leading comment '
      );
      const expected = {
        ...mockNode(),
        leadingComments: [commentBlock(' Leading comment ', 'Any')],
      };

      expect(result).toEqual(expected);
    });

    it('should add one SameLineLeadingComment leading comment and wrap with spaces', () => {
      const given = mockNode();
      const result = withSameLineLeadingConversionComments(
        given,
        'Leading comment'
      );
      const expected = {
        ...mockNode(),
        leadingComments: [
          commentBlock(' Leading comment ', 'SameLineLeadingComment'),
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should add one Any leading comment and wrap with spaces', () => {
      const given = mockNode();
      const result = withAnyLeadingConversionComments(given, 'Leading comment');
      const expected = {
        ...mockNode(),
        leadingComments: [commentBlock(' Leading comment ', 'Any')],
      };

      expect(result).toEqual(expected);
    });

    it('should add one leading trimmed comment and wrap with spaces', () => {
      const given = mockNode();
      const result = withSameLineLeadingConversionComments(
        given,
        '  \tLeading comment\t\t   \t'
      );
      const expected = {
        ...mockNode(),
        leadingComments: [
          commentBlock(' Leading comment ', 'SameLineLeadingComment'),
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should add empty comment', () => {
      const given = mockNode();
      const result = withSameLineLeadingConversionComments(given, '');
      const expected = mockNode();

      expect(result).toEqual(expected);
    });
  });

  describe('additional comment', () => {
    it('should add one leading comment to existing comments', () => {
      const given = {
        ...mockNode(),
        leadingComments: [commentBlock('Existing comment')],
      };
      const result = withSameLineLeadingConversionComments(
        given,
        ' Leading comment '
      );
      const expected = {
        ...mockNode(),
        leadingComments: [
          commentBlock('Existing comment'),
          commentBlock(' Leading comment ', 'SameLineLeadingComment'),
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should add one leading comment and wrap with spaces', () => {
      const given = {
        ...mockNode(),
        leadingComments: [commentBlock('Existing comment')],
      };
      const result = withSameLineLeadingConversionComments(
        given,
        'Leading comment'
      );
      const expected = {
        ...mockNode(),
        leadingComments: [
          commentBlock('Existing comment'),
          commentBlock(' Leading comment ', 'SameLineLeadingComment'),
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should add one leading trimmed comment and wrap with spaces', () => {
      const given = {
        ...mockNode(),
        leadingComments: [commentBlock('Existing comment')],
      };
      const result = withSameLineLeadingConversionComments(
        given,
        '  \tLeading comment\t\t   \t'
      );
      const expected = {
        ...mockNode(),
        leadingComments: [
          commentBlock('Existing comment'),
          commentBlock(' Leading comment ', 'SameLineLeadingComment'),
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should not add one empty comment', () => {
      const given = {
        ...mockNode(),
        leadingComments: [commentBlock('Existing comment')],
      };
      const result = withSameLineLeadingConversionComments(given, '');
      const expected = {
        ...mockNode(),
        leadingComments: [commentBlock('Existing comment')],
      };

      expect(result).toEqual(expected);
    });
  });
});
