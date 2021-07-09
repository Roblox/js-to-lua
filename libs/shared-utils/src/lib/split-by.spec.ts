import { splitBy } from './split-by';

describe('Split by', () => {
  it('should split by simple value', () => {
    const given = [1, 2, 3, 1, 1, 1, 2, 1];
    const expected = [1, [2, 3], 1, 1, 1, [2], 1];

    expect(
      given.reduce(
        splitBy((v): v is 1 => v === 1),
        []
      )
    ).toEqual(expected);
  });

  it('should split by inverted predicate', () => {
    const given = [1, 2, 3, 1, 1, 1, 2, 1];
    const expected = [[1], 2, 3, [1, 1, 1], 2, [1]];

    expect(
      given.reduce(
        splitBy((v): v is number => v > 1),
        []
      )
    ).toEqual(expected);
  });

  it('should split by not existing element', () => {
    const given = [1, 2, 3, 1, 1, 1, 2, 1];
    const expected = [[...given]];

    expect(
      given.reduce(
        splitBy((v): v is number => v === 4),
        []
      )
    ).toEqual(expected);
  });
  it('should split by all elements matching', () => {
    const given = [1, 2, 3, 1, 1, 1, 2, 1];
    const expected = [...given];

    expect(
      given.reduce(
        splitBy((v): v is number => true),
        []
      )
    ).toEqual(expected);
  });
});
