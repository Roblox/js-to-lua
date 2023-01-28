import { dedent } from '@js-to-lua/shared-utils';
import { allConflictsFrom } from './conflict-factory';
import { upgradeVersionHeader } from './upgrade-version-header-strategy';

const VERSION_HEADER = dedent`
  <<<<<<< HEAD
  -- ROBLOX upstream: https://github.com/jasmine/jasmine/blob/v3.5.0/spec/core/CallTrackerSpec.js
  =======
  -- ROBLOX upstream: https://github.com/jasmine/jasmine/blob/v3.6.0/spec/core/CallTrackerSpec.js
  >>>>>>> some_message`;

describe('upgrade-version-header-strategy', () => {
  it('should use the incoming version header over the current one', () => {
    const [resultContents, resultConflicts] = upgradeVersionHeader(
      VERSION_HEADER,
      allConflictsFrom(VERSION_HEADER)
    );
    expect(resultContents).toMatch(
      /^-- ROBLOX upstream: https:\/\/github.com\/jasmine\/jasmine\/blob\/v3.6.0\/spec\/core\/CallTrackerSpec.js/
    );
    expect(resultConflicts).toHaveLength(0);
  });

  it('should keep code conflicts following the version header after fixing it', () => {
    const additionalConflict = dedent`
      <<<<<<< HEAD
      current
      =======
      incoming
      >>>>>>>`;
    const contents = dedent`
      ${VERSION_HEADER}
      additional content
      ${additionalConflict}`;

    const [resultContents, resultConflicts] = upgradeVersionHeader(
      contents,
      allConflictsFrom(contents)
    );
    expect(resultContents).toMatch(
      /^-- ROBLOX upstream: https:\/\/github.com\/jasmine\/jasmine\/blob\/v3.6.0\/spec\/core\/CallTrackerSpec.js/
    );
    expect(resultConflicts).toHaveLength(1);
  });

  it(`should do nothing if there's no version header conflict`, () => {
    const contents = dedent`
      <<<<<<< HEAD
      current
      =======
      incoming
      >>>>>>>`;

    const [resultContents, resultConflicts] = upgradeVersionHeader(
      contents,
      allConflictsFrom(contents)
    );
    expect(resultContents).toEqual(contents);
    expect(resultConflicts).toHaveLength(1);
  });

  it('should handle code that contains no conflicts at all', () => {
    const contents = '';

    const [resultContents, resultConflicts] = upgradeVersionHeader(
      contents,
      allConflictsFrom(contents)
    );
    expect(resultContents).toEqual(contents);
    expect(resultConflicts).toHaveLength(0);
  });
});
