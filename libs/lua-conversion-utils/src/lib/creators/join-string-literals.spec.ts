import { stringLiteral } from '@js-to-lua/lua-types';
import { joinStringLiterals } from './join-string-literals';

describe('Join String Literals', () => {
  const joinStringLiteralWithSeparator = joinStringLiterals('[separator]');

  it('should join 2 literals', () => {
    const [leftGiven, rightGiven] = [
      stringLiteral('foo'),
      stringLiteral('bar'),
    ];
    const expected = stringLiteral('foo[separator]bar');
    const actual = joinStringLiteralWithSeparator(leftGiven, rightGiven);
    expect(actual).toEqual(expected);
  });

  it('should join 2 literals with single leading new lines', () => {
    const [leftGiven, rightGiven] = [
      stringLiteral('\nfoo'),
      stringLiteral('\nbar'),
    ];
    const expected = stringLiteral('\nfoo[separator]\nbar');
    const actual = joinStringLiteralWithSeparator(leftGiven, rightGiven);
    expect(actual).toEqual(expected);
  });

  it('should join 2 literals with 2 leading new lines', () => {
    const [leftGiven, rightGiven] = [
      stringLiteral('\n\nfoo'),
      stringLiteral('\n\nbar'),
    ];
    const expected = stringLiteral('\n\nfoo[separator]\n\nbar');
    const actual = joinStringLiteralWithSeparator(leftGiven, rightGiven);
    expect(actual).toEqual(expected);
  });

  it('should join multiple literals', () => {
    const given = [
      stringLiteral('foo'),
      stringLiteral('bar'),
      stringLiteral('baz'),
      stringLiteral('fizz'),
    ] as const;
    const expected = stringLiteral(
      'foo[separator]bar[separator]baz[separator]fizz'
    );
    const actual = joinStringLiteralWithSeparator(...given);
    expect(actual).toEqual(expected);
  });
});
