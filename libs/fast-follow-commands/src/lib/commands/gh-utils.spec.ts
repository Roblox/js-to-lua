import { normalizeTagUser } from './gh-utils';

describe('GitHub utils', () => {
  describe('normalizeTagUser', () => {
    it('should not change already correct username', () => {
      expect(normalizeTagUser('@foo')).toBe('@foo');
      expect(normalizeTagUser('@fooBar')).toBe('@fooBar');
      expect(normalizeTagUser('@foo-bar')).toBe('@foo-bar');
    });

    it('should add @ before user name if missing', () => {
      expect(normalizeTagUser('foo')).toBe('@foo');
      expect(normalizeTagUser('fooBar')).toBe('@fooBar');
      expect(normalizeTagUser('foo-bar')).toBe('@foo-bar');
    });
  });
});
