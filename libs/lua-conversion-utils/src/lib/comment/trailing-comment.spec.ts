import { commentBlock } from '@js-to-lua/lua-types';
import { mockNode } from '@js-to-lua/lua-types/test-utils';
import {
  withAnyTrailingConversionComment,
  withTrailingConversionComment,
} from './trailing-comment';

describe('Trailing conversion comment', () => {
  describe('first comment', () => {
    it('should add one SameLineTrailingComment trailing comment', () => {
      const given = mockNode();
      const result = withTrailingConversionComment(given, ' Trailing comment ');
      const expected = {
        ...mockNode(),
        trailingComments: [
          commentBlock(' Trailing comment ', 'SameLineTrailingComment'),
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should add one Any trailing comment', () => {
      const given = mockNode();
      const result = withAnyTrailingConversionComment(
        given,
        ' Trailing comment '
      );
      const expected = {
        ...mockNode(),
        trailingComments: [commentBlock(' Trailing comment ', 'Any')],
      };

      expect(result).toEqual(expected);
    });

    it('should add one SameLineTrailingComment trailing comment and wrap with spaces', () => {
      const given = mockNode();
      const result = withTrailingConversionComment(given, 'Trailing comment');
      const expected = {
        ...mockNode(),
        trailingComments: [
          commentBlock(' Trailing comment ', 'SameLineTrailingComment'),
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should add one Any trailing comment and wrap with spaces', () => {
      const given = mockNode();
      const result = withAnyTrailingConversionComment(
        given,
        'Trailing comment'
      );
      const expected = {
        ...mockNode(),
        trailingComments: [commentBlock(' Trailing comment ', 'Any')],
      };

      expect(result).toEqual(expected);
    });

    it('should add one trailing trimmed comment and wrap with spaces', () => {
      const given = mockNode();
      const result = withTrailingConversionComment(
        given,
        '  \tTrailing comment\t\t   \t'
      );
      const expected = {
        ...mockNode(),
        trailingComments: [
          commentBlock(' Trailing comment ', 'SameLineTrailingComment'),
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should add empty comment', () => {
      const given = mockNode();
      const result = withTrailingConversionComment(given, '');
      const expected = mockNode();

      expect(result).toEqual(expected);
    });
  });

  describe('additional comment', () => {
    it('should add one trailing comment to existing comments', () => {
      const given = {
        ...mockNode(),
        trailingComments: [commentBlock('Existing comment')],
      };
      const result = withTrailingConversionComment(given, ' Trailing comment ');
      const expected = {
        ...mockNode(),
        trailingComments: [
          commentBlock('Existing comment'),
          commentBlock(' Trailing comment ', 'SameLineTrailingComment'),
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should add one trailing comment and wrap with spaces', () => {
      const given = {
        ...mockNode(),
        trailingComments: [commentBlock('Existing comment')],
      };
      const result = withTrailingConversionComment(given, 'Trailing comment');
      const expected = {
        ...mockNode(),
        trailingComments: [
          commentBlock('Existing comment'),
          commentBlock(' Trailing comment ', 'SameLineTrailingComment'),
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should add one trailing trimmed comment and wrap with spaces', () => {
      const given = {
        ...mockNode(),
        trailingComments: [commentBlock('Existing comment')],
      };
      const result = withTrailingConversionComment(
        given,
        '  \tTrailing comment\t\t   \t'
      );
      const expected = {
        ...mockNode(),
        trailingComments: [
          commentBlock('Existing comment'),
          commentBlock(' Trailing comment ', 'SameLineTrailingComment'),
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should not add one empty comment', () => {
      const given = {
        ...mockNode(),
        trailingComments: [commentBlock('Existing comment')],
      };
      const result = withTrailingConversionComment(given, '');
      const expected = {
        ...mockNode(),
        trailingComments: [commentBlock('Existing comment')],
      };

      expect(result).toEqual(expected);
    });
  });
});
