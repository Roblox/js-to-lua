import { dedent } from '@js-to-lua/shared-utils';
import { Conflict } from './conflict';
import { extractFromConflict, overlappingLines } from './utilities';

describe('utilities', () => {
  describe('extractFromConflict', () => {
    it('should be able to query for specific contents from a conflict block', () => {
      const inputConflict = new Conflict(
        'pre1 current post1',
        'pre2 incoming post2',
        'currentName',
        'incomingName'
      );
      const expectedCurrentConflictPart0 = new Conflict(
        'pre1 ',
        undefined,
        'currentName',
        'incomingName'
      );
      const expectedIncomingConflictPart0 = new Conflict(
        undefined,
        'pre2 ',
        'currentName',
        'incomingName'
      );
      const expectedCurrentConflictPart1 = new Conflict(
        ' post1',
        undefined,
        'currentName',
        'incomingName'
      );
      const expectedIncomingConflictPart1 = new Conflict(
        undefined,
        ' post2',
        'currentName',
        'incomingName'
      );

      expect(extractFromConflict(inputConflict, /current/, 0)?.toString()).toBe(
        expectedCurrentConflictPart0.toString()
      );
      expect(
        extractFromConflict(inputConflict, /incoming/, 0)?.toString()
      ).toBe(expectedIncomingConflictPart0.toString());
      expect(extractFromConflict(inputConflict, /current/, 1)?.toString()).toBe(
        expectedCurrentConflictPart1.toString()
      );
      expect(
        extractFromConflict(inputConflict, /incoming/, 1)?.toString()
      ).toBe(expectedIncomingConflictPart1.toString());
    });

    it('should not return a conflict for queries that should not match', () => {
      const inputConflict = new Conflict(
        'pre1 current post1',
        'pre2 incoming post2',
        'currentName',
        'incomingName'
      );

      expect(
        extractFromConflict(inputConflict, /doesnotexist/, 0)?.toString()
      ).toBeUndefined();
      expect(
        extractFromConflict(inputConflict, /doesnotexist/, 1)?.toString()
      ).toBeUndefined();
    });
  });

  describe('overlappingLines', () => {
    it('should return the number of overlapping lines between two sets of code', () => {
      const left = dedent`
        local test1 = ""
        local test2 = ""
        local test3 = ""
        local test4 = ""`;
      const right = dedent`
        local test1 = ""
        local test2 = ""
        local test34 = ""
        local test4 = ""`;

      expect(overlappingLines(left, right)).toBe(3);
    });

    it('should return the the shared line count of both sets of code if they match', () => {
      const example = dedent`
        local test1 = ""
        local test2 = ""
        local test3 = ""
        local test4 = ""`;

      expect(overlappingLines(example, example)).toBe(4);
    });

    it('should return 1 for two empty sets of code', () => {
      expect(overlappingLines('', '')).toBe(1);
    });
  });
});
