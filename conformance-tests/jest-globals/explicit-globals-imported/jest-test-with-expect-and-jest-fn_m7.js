import { jest, describe, it, expect } from '@jest/globals';

describe('foo', () => {
  it('bar', () => {
    const myFn = jest.fn()
    myFn(1)
    expect(myFn).toHaveBeenCalledWith(1)
  });
});
