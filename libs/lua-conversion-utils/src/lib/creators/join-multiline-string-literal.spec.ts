import { multilineStringLiteral } from '@js-to-lua/lua-types';
import { joinMultilineStringLiterals } from './join-multiline-string-literals';

describe('Join Multiline String Literal', () => {
  const joinMultilineStringLiteralWithSeparator =
    joinMultilineStringLiterals('[separator]');

  it('should join 2 literals', () => {
    const given = [
      multilineStringLiteral('foo'),
      multilineStringLiteral('bar'),
    ] as const;
    const expected = multilineStringLiteral('foo[separator]bar');
    const actual = joinMultilineStringLiteralWithSeparator(...given);
    expect(actual).toEqual(expected);
  });

  it('should join 2 literals with single leading new lines', () => {
    const given = [
      multilineStringLiteral('\nfoo'),
      multilineStringLiteral('\nbar'),
    ] as const;
    const expected = multilineStringLiteral('\nfoo[separator]bar');
    const actual = joinMultilineStringLiteralWithSeparator(...given);
    expect(actual).toEqual(expected);
  });

  it('should join 2 literals with 2 leading new lines', () => {
    const given = [
      multilineStringLiteral('\n\nfoo'),
      multilineStringLiteral('\n\nbar'),
    ] as const;
    const expected = multilineStringLiteral('\n\nfoo[separator]\nbar');
    const actual = joinMultilineStringLiteralWithSeparator(...given);
    expect(actual).toEqual(expected);
  });

  it('should join multiple literals', () => {
    const given = [
      multilineStringLiteral('foo'),
      multilineStringLiteral('bar'),
      multilineStringLiteral('baz'),
      multilineStringLiteral('fizz'),
    ] as const;
    const expected = multilineStringLiteral(
      'foo[separator]bar[separator]baz[separator]fizz'
    );
    const actual = joinMultilineStringLiteralWithSeparator(...given);
    expect(actual).toEqual(expected);
  });

  it('should join multiple literals with single leading new lines', () => {
    const given = [
      multilineStringLiteral('\nfoo'),
      multilineStringLiteral('\nbar'),
      multilineStringLiteral('\nbaz'),
      multilineStringLiteral('\nfizz'),
    ] as const;
    const expected = multilineStringLiteral(
      '\nfoo[separator]bar[separator]baz[separator]fizz'
    );
    const actual = joinMultilineStringLiteralWithSeparator(...given);
    expect(actual).toEqual(expected);
  });

  it('should join multiple literals with 2 leading new lines', () => {
    const given = [
      multilineStringLiteral('\n\nfoo'),
      multilineStringLiteral('\n\nbar'),
      multilineStringLiteral('\n\nbaz'),
      multilineStringLiteral('\n\nfizz'),
    ] as const;
    const expected = multilineStringLiteral(
      '\n\nfoo[separator]\nbar[separator]\nbaz[separator]\nfizz'
    );
    const actual = joinMultilineStringLiteralWithSeparator(...given);
    expect(actual).toEqual(expected);
  });
});
