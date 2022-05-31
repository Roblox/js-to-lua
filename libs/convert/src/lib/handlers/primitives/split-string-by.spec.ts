import { splitStringBy } from './split-string-by';

describe('Split String by', () => {
  it(`should not split if regex doesn't match`, () => {
    const str = 'abc.def,ghi';
    const regex = /[:]/g;
    const expected = ['abc.def,ghi'];
    const actual = splitStringBy(regex, str);

    expect(actual).toEqual(expected);
  });

  it('should split by regex - single matches', () => {
    const str = 'abc.def,ghi';
    const regex = /[.,]/g;
    const expected = ['abc', ['.'], 'def', [','], 'ghi'];
    const actual = splitStringBy(regex, str);

    expect(actual).toEqual(expected);
  });

  it('should split by regex - grouped matches', () => {
    const str = 'abc.def.,g.h.ijk.,.lmn.,..,op';
    const regex = /[.,]/g;
    const expected = [
      'abc',
      ['.'],
      'def',
      ['.', ','],
      'g',
      ['.'],
      'h',
      ['.'],
      'ijk',
      ['.', ',', '.'],
      'lmn',
      ['.', ',', '.', '.', ','],
      'op',
    ];
    const actual = splitStringBy(regex, str);

    expect(actual).toEqual(expected);
  });

  it('should split by regex - grouped matches (end matches regex)', () => {
    const str = 'abc.def.,g.h.ijk.,.lmn.,..,op.';
    const regex = /[.,]/g;
    const expected = [
      'abc',
      ['.'],
      'def',
      ['.', ','],
      'g',
      ['.'],
      'h',
      ['.'],
      'ijk',
      ['.', ',', '.'],
      'lmn',
      ['.', ',', '.', '.', ','],
      'op',
      ['.'],
    ];
    const actual = splitStringBy(regex, str);

    expect(actual).toEqual(expected);
  });

  it('should split by regex - grouped matches (beginning matches regex)', () => {
    const str = '.abc.def.,g.h.ijk.,.lmn.,..,op';
    const regex = /[.,]/g;
    const expected = [
      ['.'],
      'abc',
      ['.'],
      'def',
      ['.', ','],
      'g',
      ['.'],
      'h',
      ['.'],
      'ijk',
      ['.', ',', '.'],
      'lmn',
      ['.', ',', '.', '.', ','],
      'op',
    ];
    const actual = splitStringBy(regex, str);

    expect(actual).toEqual(expected);
  });

  it('should split by regex - grouped matches (beginning and end matches regex)', () => {
    const str = ',.abc.def.,g.h.ijk.,.lmn.,..,op.,';
    const regex = /[.,]/g;
    const expected = [
      [',', '.'],
      'abc',
      ['.'],
      'def',
      ['.', ','],
      'g',
      ['.'],
      'h',
      ['.'],
      'ijk',
      ['.', ',', '.'],
      'lmn',
      ['.', ',', '.', '.', ','],
      'op',
      ['.', ','],
    ];
    const actual = splitStringBy(regex, str);

    expect(actual).toEqual(expected);
  });
});
