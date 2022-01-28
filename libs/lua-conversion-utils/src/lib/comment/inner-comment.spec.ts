import { commentBlock } from '@js-to-lua/lua-types';
import { mockNode } from '@js-to-lua/lua-types/test-utils';
import { withInnerConversionComment } from './inner-comment';

describe('Inner conversion comment', () => {
  describe('first comment', () => {
    it('should add one inner comment', () => {
      const given = mockNode();
      const result = withInnerConversionComment(given, ' Inner comment ');
      const expected = {
        ...mockNode(),
        innerComments: [
          commentBlock(' Inner comment ', 'SameLineInnerComment'),
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should add one inner comment and wrap with spaces', () => {
      const given = mockNode();
      const result = withInnerConversionComment(given, 'Inner comment');
      const expected = {
        ...mockNode(),
        innerComments: [
          commentBlock(' Inner comment ', 'SameLineInnerComment'),
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should add one inner trimmed comment and wrap with spaces', () => {
      const given = mockNode();
      const result = withInnerConversionComment(
        given,
        '  \tInner comment\t\t   \t'
      );
      const expected = {
        ...mockNode(),
        innerComments: [
          commentBlock(' Inner comment ', 'SameLineInnerComment'),
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should add empty comment', () => {
      const given = mockNode();
      const result = withInnerConversionComment(given, '');
      const expected = mockNode();

      expect(result).toEqual(expected);
    });
  });

  describe('additional comment', () => {
    it('should add one inner comment to existing comments', () => {
      const given = {
        ...mockNode(),
        innerComments: [commentBlock('Existing comment')],
      };
      const result = withInnerConversionComment(given, ' Inner comment ');
      const expected = {
        ...mockNode(),
        innerComments: [
          commentBlock('Existing comment'),
          commentBlock(' Inner comment ', 'SameLineInnerComment'),
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should add one inner comment and wrap with spaces', () => {
      const given = {
        ...mockNode(),
        innerComments: [commentBlock('Existing comment')],
      };
      const result = withInnerConversionComment(given, 'Inner comment');
      const expected = {
        ...mockNode(),
        innerComments: [
          commentBlock('Existing comment'),
          commentBlock(' Inner comment ', 'SameLineInnerComment'),
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should add one inner trimmed comment and wrap with spaces', () => {
      const given = {
        ...mockNode(),
        innerComments: [commentBlock('Existing comment')],
      };
      const result = withInnerConversionComment(
        given,
        '  \tInner comment\t\t   \t'
      );
      const expected = {
        ...mockNode(),
        innerComments: [
          commentBlock('Existing comment'),
          commentBlock(' Inner comment ', 'SameLineInnerComment'),
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should not add one empty comment', () => {
      const given = {
        ...mockNode(),
        innerComments: [commentBlock('Existing comment')],
      };
      const result = withInnerConversionComment(given, '');
      const expected = {
        ...mockNode(),
        innerComments: [commentBlock('Existing comment')],
      };

      expect(result).toEqual(expected);
    });
  });
});
