import { describe, it, expect } from '@jest/globals';

describe('foo', () => {
  it('bar', () => {
    const foo = 1, bar = 1
    expect(foo).toEqual(bar)
  });
});
