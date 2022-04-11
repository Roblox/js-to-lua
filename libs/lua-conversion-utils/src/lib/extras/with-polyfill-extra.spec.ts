import { nodeGroup } from '@js-to-lua/lua-types';
import {
  hasPolyfillExtra,
  PolyfillID,
  withPolyfillExtra,
} from './with-polyfill-extra';

describe('With polyfill extra', () => {
  const polyfillIds = Array<PolyfillID>(
    'Array',
    'Boolean',
    'Map',
    'Number',
    'Object',
    'Set',
    'String',
    'Symbol',
    'WeakMap',
    'clearTimeout',
    'console',
    'setTimeout'
  );

  it.each(polyfillIds)(
    'should return true when with polyfill extra (%s)',
    (id) => {
      const given = withPolyfillExtra(id)(nodeGroup([]));
      expect(hasPolyfillExtra(id, given)).toBe(true);
    }
  );

  it.each(polyfillIds)(
    'should return false when with different polyfill type extra (%s)',
    (id) => {
      const given = withPolyfillExtra(id)(nodeGroup([]));

      polyfillIds
        .filter((v) => v !== id)
        .forEach((differentId) => {
          expect(hasPolyfillExtra(differentId, given)).toBe(false);
        });
    }
  );

  it.each(polyfillIds)(
    'should return false when not with polyfill type extra (%s)',
    (id) => {
      const given = nodeGroup([]);
      expect(hasPolyfillExtra(id, given)).toBe(false);
    }
  );
});
