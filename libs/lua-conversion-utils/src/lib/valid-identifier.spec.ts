import {
  capitalizeOnInvalidChars,
  toValidIdentifier,
} from './valid-identifier';

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

describe('capitalizeOnInvalidChars', () => {
  it('should remove leading invalid Lua identifiers chars', () => {
    expect(capitalizeOnInvalidChars('!foo')).toBe('foo');
    expect(capitalizeOnInvalidChars('@foo')).toBe('foo');
    expect(capitalizeOnInvalidChars('$foo')).toBe('foo');
    expect(capitalizeOnInvalidChars('%foo')).toBe('foo');
    expect(capitalizeOnInvalidChars('^foo')).toBe('foo');
    expect(capitalizeOnInvalidChars('&foo')).toBe('foo');
    expect(capitalizeOnInvalidChars('*foo')).toBe('foo');
    expect(capitalizeOnInvalidChars('.foo')).toBe('foo');
    expect(capitalizeOnInvalidChars('-foo')).toBe('foo');
  });

  it('should remove trailing invalid Lua identifiers chars', () => {
    expect(capitalizeOnInvalidChars('foo!')).toBe('foo');
    expect(capitalizeOnInvalidChars('foo@')).toBe('foo');
    expect(capitalizeOnInvalidChars('foo$')).toBe('foo');
    expect(capitalizeOnInvalidChars('foo%')).toBe('foo');
    expect(capitalizeOnInvalidChars('foo^')).toBe('foo');
    expect(capitalizeOnInvalidChars('foo&')).toBe('foo');
    expect(capitalizeOnInvalidChars('foo*')).toBe('foo');
    expect(capitalizeOnInvalidChars('foo.')).toBe('foo');
    expect(capitalizeOnInvalidChars('foo-')).toBe('foo');
  });

  it('should capitalize on invalid Lua identifiers chars inside the string', () => {
    expect(capitalizeOnInvalidChars('bar!foo')).toBe('barFoo');
    expect(capitalizeOnInvalidChars('bar@foo')).toBe('barFoo');
    expect(capitalizeOnInvalidChars('bar$foo')).toBe('barFoo');
    expect(capitalizeOnInvalidChars('bar%foo')).toBe('barFoo');
    expect(capitalizeOnInvalidChars('bar^foo')).toBe('barFoo');
    expect(capitalizeOnInvalidChars('bar&foo')).toBe('barFoo');
    expect(capitalizeOnInvalidChars('bar*foo')).toBe('barFoo');
    expect(capitalizeOnInvalidChars('bar.foo')).toBe('barFoo');
    expect(capitalizeOnInvalidChars('bar-foo')).toBe('barFoo');
  });

  it('should capitalize on invalid Lua identifiers chars inside the string and remove leading/trailing invalid chars', () => {
    expect(capitalizeOnInvalidChars('!bar!foo!')).toBe('barFoo');
    expect(capitalizeOnInvalidChars('@bar@foo@')).toBe('barFoo');
    expect(capitalizeOnInvalidChars('$bar$foo$')).toBe('barFoo');
    expect(capitalizeOnInvalidChars('%bar%foo%')).toBe('barFoo');
    expect(capitalizeOnInvalidChars('^bar^foo^')).toBe('barFoo');
    expect(capitalizeOnInvalidChars('&bar&foo&')).toBe('barFoo');
    expect(capitalizeOnInvalidChars('*bar*foo*')).toBe('barFoo');
    expect(capitalizeOnInvalidChars('.bar.foo.')).toBe('barFoo');
    expect(capitalizeOnInvalidChars('-bar-foo-')).toBe('barFoo');
  });
});
