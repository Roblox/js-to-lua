import { nodeGroup } from '@js-to-lua/lua-types';
import {
  hasPolyfillTypeExtra,
  PolyfillTypeID,
  withPolyfillTypeExtra,
} from './with-polyfill-type-extra';

describe('With polyfill type extra', () => {
  const polyfillTypeIds = Array<PolyfillTypeID>(
    'Array',
    'Error',
    'Map',
    'Object',
    'Promise',
    'PromiseLike',
    'Set',
    'WeakMap'
  );

  it.each(polyfillTypeIds)(
    'should return true when with polyfill type extra (%s)',
    (id) => {
      const given = withPolyfillTypeExtra(id, [])(nodeGroup([]));
      expect(hasPolyfillTypeExtra(id, given)).toBe(true);
    }
  );

  it.each(polyfillTypeIds)(
    'should return false when with different polyfill type extra (%s)',
    (id) => {
      const given = withPolyfillTypeExtra(id, [])(nodeGroup([]));

      polyfillTypeIds
        .filter((v) => v !== id)
        .forEach((differentId) => {
          expect(hasPolyfillTypeExtra(differentId, given)).toBe(false);
        });
    }
  );

  it.each(polyfillTypeIds)(
    'should return false when not with polyfill type extra (%s)',
    (id) => {
      const given = nodeGroup([]);
      expect(hasPolyfillTypeExtra(id, given)).toBe(false);
    }
  );
});
