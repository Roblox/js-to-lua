import { nodeGroup, stringLiteral } from '@js-to-lua/lua-types';
import * as assert from 'assert';
import {
  createWithAlternativeExpressionExtras,
  getAlternativeExpressionExtra,
  isWithAlternativeExpressionExtras,
} from './with-alternative-identifier-expression-extras';

describe('With alternative identifier expression extras', () => {
  const withAlternativeIdentifierExtra = createWithAlternativeExpressionExtras(
    stringLiteral('test')
  );

  it('should return true when with alternative identifier expression extras', () => {
    const given = withAlternativeIdentifierExtra(nodeGroup([]));
    expect(isWithAlternativeExpressionExtras(given)).toBe(true);
  });

  it('should return false when not with alternative identifier expression extras', () => {
    const given = nodeGroup([]);
    expect(isWithAlternativeExpressionExtras(given)).toBe(false);
  });

  it('should extract alternative identifier expression', () => {
    const given = withAlternativeIdentifierExtra(nodeGroup([]));
    assert(isWithAlternativeExpressionExtras(given));
    expect(getAlternativeExpressionExtra(given)).toEqual(stringLiteral('test'));
  });
});
