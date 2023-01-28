import { dedent } from '@js-to-lua/shared-utils';
import { allConflictsFrom } from './conflict-factory';
import { matchComments } from './match-comments-strategy';

const CURRENT_CODE_EXAMPLE = dedent`
  local x = 5
  local y = 10
  local z = 15`;

const INCOMING_CODE_EXAMPLE = dedent`
  local x = 10
  local y = 15
  -- local z = 15`;

describe('match-comments-strategy', () => {
  it('should move commented out code that is aligned out of the conflict block', () => {
    const truncatedCurrent = dedent`
      local x = 5
      local y = 10`;
    const truncatedIncoming = dedent`
      local x = 10
      local y = 15`;
    const moved = `-- local z = 15`;

    const contents = dedent`
      <<<<<<< HEAD
      ${CURRENT_CODE_EXAMPLE}
      =======
      ${INCOMING_CODE_EXAMPLE}
      >>>>>>> some_message`;
    const expectedContents = dedent`
      <<<<<<< HEAD
      ${truncatedCurrent}
      =======
      ${truncatedIncoming}
      >>>>>>> some_message
      ${moved}`;

    const [newContents, newConflicts] = matchComments(
      contents,
      allConflictsFrom(contents)
    );
    expect(newContents).toEqual(expectedContents);
    expect(newConflicts.length).toBe(1);
  });

  it('should do nothing if there are no conflicts', () => {
    const [newContents, newConflicts] = matchComments(
      CURRENT_CODE_EXAMPLE,
      allConflictsFrom(CURRENT_CODE_EXAMPLE)
    );
    expect(newContents).toEqual(CURRENT_CODE_EXAMPLE);
    expect(newConflicts.length).toBe(0);
  });

  it('should handle empty conflict blocks with grace', () => {
    const contents = `<<<<<<< HEAD\n=======\n>>>>>>> some_message`;

    const [newContents, newConflicts] = matchComments(
      contents,
      allConflictsFrom(contents)
    );
    expect(newContents).toEqual(contents);
    expect(newConflicts.length).toBe(1);
  });
});
