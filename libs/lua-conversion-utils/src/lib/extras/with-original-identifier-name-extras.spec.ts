import { nodeGroup } from '@js-to-lua/lua-types';
import * as assert from 'assert';
import {
  createWithOriginalIdentifierNameExtras,
  getOriginalIdentifierNameExtra,
  isWithOriginalIdentifierNameExtras,
} from './with-original-identifier-name-extras';

describe('With original identifier name extras', () => {
  const withOriginalIdentifierNameExtra =
    createWithOriginalIdentifierNameExtras('test');

  it('should return true when with original identifier name extras', () => {
    const given = withOriginalIdentifierNameExtra(nodeGroup([]));
    expect(isWithOriginalIdentifierNameExtras(given)).toBe(true);
  });

  it('should return false when not with original identifier name extras', () => {
    const given = nodeGroup([]);
    expect(isWithOriginalIdentifierNameExtras(given)).toBe(false);
  });

  it('should extract alternative identifier expression', () => {
    const given = withOriginalIdentifierNameExtra(nodeGroup([]));
    assert(isWithOriginalIdentifierNameExtras(given));
    expect(getOriginalIdentifierNameExtra(given)).toEqual('test');
  });
});
