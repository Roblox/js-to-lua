import { removeInvalidChars, toValidIdentifier } from './valid-identifier';

describe('toValidIdentifier', () => {
  it('should produce valid Lua identifiers chars', () => {
    expect(toValidIdentifier('!foo')).toBe('_foo');
    expect(toValidIdentifier('@foo')).toBe('_foo');
    expect(toValidIdentifier('$foo')).toBe('_foo');
    expect(toValidIdentifier('%foo')).toBe('_foo');
    expect(toValidIdentifier('^foo')).toBe('_foo');
    expect(toValidIdentifier('&foo')).toBe('_foo');
    expect(toValidIdentifier('*foo')).toBe('_foo');
  });
});

describe('removeInvalidChars', () => {
  it('should remove invalid Lua identifiers chars', () => {
    expect(removeInvalidChars('!foo')).toBe('foo');
    expect(removeInvalidChars('@foo')).toBe('foo');
    expect(removeInvalidChars('$foo')).toBe('foo');
    expect(removeInvalidChars('%foo')).toBe('foo');
    expect(removeInvalidChars('^foo')).toBe('foo');
    expect(removeInvalidChars('&foo')).toBe('foo');
    expect(removeInvalidChars('*foo')).toBe('foo');
  });
});
