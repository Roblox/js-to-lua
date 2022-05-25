import { nodeGroup } from '@js-to-lua/lua-types';
import {
  getOptionalOriginalIds,
  getOriginalIds,
  isWithOriginalIds,
  withOriginalIds,
} from './with-original-ids-extra';

describe('With original ids extra', () => {
  it('should return true when with original ids extra', () => {
    const given = withOriginalIds(['foo', 'bar'], nodeGroup([]));
    expect(isWithOriginalIds(given)).toBe(true);
  });

  it('should return false when not with original ids extra', () => {
    const given = nodeGroup([]);
    expect(isWithOriginalIds(given)).toBe(false);
  });

  it('should extract original ids', () => {
    const given = withOriginalIds(['foo', 'bar'], nodeGroup([]));
    expect(getOriginalIds(given)).toEqual(['foo', 'bar']);
  });

  it('should extract optional original ids when exist', () => {
    const given = withOriginalIds(['foo', 'bar'], nodeGroup([]));
    expect(getOptionalOriginalIds(given)).toEqual(['foo', 'bar']);
  });

  it("should return empty originalIds when don't exist", () => {
    const given = nodeGroup([]);
    expect(getOptionalOriginalIds(given)).toEqual([]);
  });
});
