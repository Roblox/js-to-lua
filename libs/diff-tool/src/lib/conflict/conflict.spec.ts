import { Conflict } from './conflict';
import { dedent } from '@js-to-lua/shared-utils';

describe('Conflict', () => {
  const changeSets = [
    'Some conflicted original line\nAnd another one',
    'A new incoming line\nfollowed by more\nand more',
  ];

  const SUT = new Conflict(
    changeSets[0],
    changeSets[1],
    'HEAD',
    'feat/this-is-a-test'
  );

  it('knows its combined length', () => {
    expect(SUT.length).toBe(5);
  });

  describe('toString', () => {
    it('can convert a normal conflict', () => {
      expect(String(SUT)).toBe(
        dedent`
        <<<<<<< HEAD
        Some conflicted original line
        And another one
        =======
        A new incoming line
        followed by more
        and more
        >>>>>>> feat/this-is-a-test`
      );
    });
    it('can convert an empty current', () => {
      expect(
        String(new Conflict(null, changeSets[1], 'HEAD', 'incoming'))
      ).toBe(
        dedent`
        <<<<<<< HEAD
        =======
        A new incoming line
        followed by more
        and more
        >>>>>>> incoming`
      );
    });
    it('can convert an empty incoming', () => {
      expect(
        String(new Conflict(changeSets[0], null, 'HEAD', 'incoming'))
      ).toBe(
        dedent`
        <<<<<<< HEAD
        Some conflicted original line
        And another one
        =======
        >>>>>>> incoming`
      );
    });
    it('can handle the absence of names', () => {
      expect(String(new Conflict(changeSets[0], changeSets[1]))).toBe(
        dedent`
        <<<<<<<
        Some conflicted original line
        And another one
        =======
        A new incoming line
        followed by more
        and more
        >>>>>>>`
      );
    });
    it('preserves non new line whitespace characters', () => {
      expect(String(new Conflict('\tfoo', ' bar'))).toBe(
        dedent`
        <<<<<<<
        \tfoo
        =======
         bar
        >>>>>>>`
      );
    });
    it('handles a single newline as change', () => {
      expect(String(new Conflict('\n', null))).toBe(
        dedent`
        <<<<<<<

        =======
        >>>>>>>`
      );
    });
  });
});
